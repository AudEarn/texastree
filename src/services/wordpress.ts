interface WordPressPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    author?: Array<{
      name: string;
    }>;
  };
  _embedded_categories?: Array<{
    id: number;
    name: string;
  }>;
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface FetchPostsOptions {
  page?: number;
  perPage?: number;
  categories?: number[];
  featured?: boolean;
  search?: string;
}

const WORDPRESS_API_URL =
  'https://grey-herring-327677.hostingersite.com/treeserve/wp-json/wp/v2';

// Cache for categories to avoid repeated fetches
let categoriesCache: WordPressCategory[] = [];
// Cache for posts with timeout
const postsCache: {
  data: WordPressPost[] | null;
  timestamp: number;
  key: string;
} = {
  data: null,
  timestamp: 0,
  key: '',
};

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Fetch categories with caching
 */
async function fetchCategories(): Promise<WordPressCategory[]> {
  if (categoriesCache.length > 0) {
    return categoriesCache;
  }

  try {
    const categoriesResponse = await fetch(`${WORDPRESS_API_URL}/categories?per_page=100`);
    if (!categoriesResponse.ok) {
      throw new Error('Failed to fetch categories');
    }

    const categories: WordPressCategory[] = await categoriesResponse.json();
    categoriesCache = categories;
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Fetch posts with pagination, caching and optional filtering
 */
export async function fetchPosts(options: FetchPostsOptions = {}): Promise<WordPressPost[]> {
  const {
    page = 1,
    perPage = 20,
    categories = [],
    featured = false,
    search = '',
  } = options;

  // Create a cache key based on parameters
  const cacheKey = `posts_${page}_${perPage}_${categories.join(',')}_${featured}_${search}`;

  // Return cached data if still valid
  if (
    postsCache.data &&
    postsCache.key === cacheKey &&
    Date.now() - postsCache.timestamp < CACHE_EXPIRATION
  ) {
    return postsCache.data;
  }

  try {
    // Build the API URL with parameters
    let url = `${WORDPRESS_API_URL}/posts?_embed&page=${page}&per_page=${perPage}`;

    if (categories.length > 0) {
      url += `&categories=${categories.join(',')}`;
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (featured) {
      url += '&sticky=true';
    }

    // Fetch categories in parallel
    const categoriesPromise = fetchCategories();

    // Fetch posts
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const posts = await response.json();
    const fetchedCategories = await categoriesPromise;

    // Attach category data to each post
    const postsWithCategories = posts.map((post: WordPressPost) => ({
      ...post,
      _embedded_categories: post.categories
        .map((catId) => fetchedCategories.find((cat) => cat.id === catId))
        .filter(Boolean),
    }));

    // Update the cache
    postsCache.data = postsWithCategories;
    postsCache.timestamp = Date.now();
    postsCache.key = cacheKey;

    return postsWithCategories;
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    throw error;
  }
}

/**
 * Fetch both featured and regular posts in one call using Promise.all for parallel requests
 */
export async function fetchHomePagePosts(): Promise<{
  featured: WordPressPost[];
  regular: WordPressPost[];
}> {
  try {
    // First try to get sticky/featured posts
    const featuredPosts = await fetchPosts({ featured: true, perPage: 1 });

    // Get regular posts
    const regularPosts = await fetchPosts({ page: 1, perPage: 12 });

    // If no featured posts found, use the first regular post as featured
    if (featuredPosts.length === 0 && regularPosts.length > 0) {
      const firstPost = regularPosts[0];
      const remainingPosts = regularPosts.slice(1);

      return {
        featured: [firstPost],
        regular: remainingPosts
      };
    }

    // Filter out any duplicates between featured and regular posts
    const filteredRegularPosts = regularPosts.filter(post =>
      !featuredPosts.some(featuredPost => featuredPost.id === post.id)
    );

    return {
      featured: featuredPosts,
      regular: filteredRegularPosts,
    };
  } catch (error) {
    console.error('Error fetching home page posts:', error);
    throw error;
  }
}

export async function fetchPost(id: number): Promise<WordPressPost> {
  try {
    // Fetch categories
    const fetchedCategories = await fetchCategories();

    // Then fetch the post with embedded data
    const response = await fetch(`${WORDPRESS_API_URL}/posts/${id}?_embed`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    const post = await response.json();

    // Attach category data to the post
    const postWithCategories = {
      ...post,
      _embedded_categories: post.categories
        .map((catId: number) => fetchedCategories.find((cat) => cat.id === catId))
        .filter(Boolean),
    };

    return postWithCategories;
  } catch (error) {
    console.error('Error fetching WordPress post:', error);
    throw error;
  }
}
