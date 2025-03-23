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

const WORDPRESS_API_URL =
  'https://grey-herring-327677.hostingersite.com/treeserve/wp-json/wp/v2';

export async function fetchPosts(): Promise<WordPressPost[]> {
  try {
    // First fetch all categories
    const categoriesResponse = await fetch(`${WORDPRESS_API_URL}/categories`);
    if (!categoriesResponse.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categories: WordPressCategory[] = await categoriesResponse.json();

    // Then fetch posts with embedded data
    const response = await fetch(`${WORDPRESS_API_URL}/posts?_embed`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts = await response.json();

    // Attach category data to each post
    const postsWithCategories = posts.map((post: WordPressPost) => ({
      ...post,
      _embedded_categories: post.categories
        .map((catId) => categories.find((cat) => cat.id === catId))
        .filter(Boolean),
    }));

    console.log('WordPress Posts Data:', postsWithCategories); // Debug log
    return postsWithCategories;
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    throw error;
  }
}

export async function fetchPost(id: number): Promise<WordPressPost> {
  try {
    // First fetch all categories
    const categoriesResponse = await fetch(`${WORDPRESS_API_URL}/categories`);
    if (!categoriesResponse.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categories: WordPressCategory[] = await categoriesResponse.json();

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
        .map((catId: number) => categories.find((cat) => cat.id === catId))
        .filter(Boolean),
    };

    console.log('Single Post Data:', postWithCategories); // Debug log
    return postWithCategories;
  } catch (error) {
    console.error('Error fetching WordPress post:', error);
    throw error;
  }
}
