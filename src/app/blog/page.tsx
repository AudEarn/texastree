
// 'use client'

// import { useToast } from "@/hooks/use-toast";
// import { fetchPosts } from "@/services/wordpress";
// import { ArrowRight } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// interface WordPressPost {
//   id: number;
//   date: string;
//   title: {
//     rendered: string;
//   };
//   content: {
//     rendered: string;
//   };
//   excerpt: {
//     rendered: string;
//   };
//   featured_media: number;
//   _embedded?: {
//     "wp:featuredmedia"?: Array<{
//       source_url: string;
//     }>;
//     author?: Array<{
//       name: string;
//     }>;
//   };
//   categories: number[];
//   _embedded_categories?: Array<{
//     id: number;
//     name: string;
//   }>;
// }

// const Blog = () => {
//   const router = useRouter();
//   const [posts, setPosts] = useState<WordPressPost[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     const loadPosts = async () => {
//       try {
//         const fetchedPosts = await fetchPosts();
//         setPosts(fetchedPosts);
//       } catch (error) {
//         console.error("Error loading posts:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load blog posts",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadPosts();
//   }, [toast]);

//   const extractFirstImageUrl = (content: string) => {
//     const imgRegex = /<img[^>]+src="([^">]+)"/;
//     const match = content.match(imgRegex);
//     return match ? match[1] : null;
//   };

//   // Get the most recent post as featured
//   const featuredPosts = posts.slice(0, 1);

//   // Rest of the posts as regular posts
//   const regularPosts = posts.slice(1);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-800">Loading posts...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Featured Post */}
//         {featuredPosts.length > 0 && (
//           <div className="mb-24">
//             {featuredPosts.map((post) => {
//               const imageUrl =
//                 post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
//                 extractFirstImageUrl(post.content.rendered);

//               return (
//                 <div
//                   key={post.id}
//                   className="relative flex flex-col md:flex-row gap-12"
//                 >
//                   <div className="w-full md:w-2/5 flex flex-col justify-between">
//                     <h1
//                       className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight"
//                       dangerouslySetInnerHTML={{
//                         __html: post.title.rendered,
//                       }}
//                     />
//                     <div className="space-y-4 mt-auto pt-6">
//                       <button
//                         onClick={() => router.push(`/blog/post/${post.id}`)}
//                         className="inline-flex items-center text-gray-800 hover:text-[#44FF90] transition-colors group"
//                       >
//                         <span className="text-lg">Read More</span>
//                         <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
//                       </button>
//                       <div className="w-full h-px bg-gray-300" />
//                     </div>
//                   </div>
//                   <div className="w-full md:w-3/5">
//                     <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
//                       {imageUrl ? (
//                         <img
//                           src={imageUrl}
//                           alt={post.title.rendered}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-gradient-to-r from-white to-gray-100" />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Regular Posts Grid */}
//         {regularPosts.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {regularPosts.map((post) => {
//               const imageUrl =
//                 post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
//                 extractFirstImageUrl(post.content.rendered);

//               return (
//                 <div
//                   key={post.id}
//                   className="group cursor-pointer"
//                   onClick={() => router.push(`/blog/post/${post.id}`)}
//                 >
//                   <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3 shadow-lg">
//                     {imageUrl ? (
//                       <img
//                         src={imageUrl}
//                         alt={post.title.rendered}
//                         className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gradient-to-r from-white to-gray-100" />
//                     )}
//                   </div>
//                   <h3
//                     className="text-base font-semibold text-gray-800 mb-2 group-hover:text-[#44FF90] transition-colors line-clamp-2"
//                     dangerouslySetInnerHTML={{
//                       __html: post.title.rendered,
//                     }}
//                   />
//                   <div className="text-xs text-gray-600 flex items-center gap-2">
//                     <p>{post._embedded?.author?.[0]?.name}</p>
//                     <span>•</span>
//                     <p>{new Date(post.date).toLocaleDateString()}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {posts.length === 0 && (
//           <div className="text-center text-gray-600 mt-8">
//             No blog posts yet. Check back later!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Blog;

import { fetchHomePagePosts } from "@/services/wordpress";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Blog | TreeHub',
  description: 'Latest blog posts and updates',
};

export default async function Blog() {
  // Use the optimized function that fetches featured and regular posts in parallel
  const { featured: featuredPosts, regular: regularPosts } = await fetchHomePagePosts();

  const extractFirstImageUrl = (content: string) => {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Featured Post */}
        {featuredPosts.length > 0 && (
          <div className="mb-24">
            {featuredPosts.map((post) => {
              const imageUrl =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                extractFirstImageUrl(post.content.rendered);

              return (
                <div
                  key={post.id}
                  className="relative flex flex-col md:flex-row gap-12"
                >
                  <div className="w-full md:w-2/5 flex flex-col justify-between">
                    <h1
                      className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight"
                      dangerouslySetInnerHTML={{
                        __html: post.title.rendered,
                      }}
                    />
                    <div className="space-y-4 mt-auto pt-6">
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-gray-800 hover:text-[#44FF90] transition-colors group"
                      >
                        <span className="text-lg">Read More</span>
                        <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <div className="w-full h-px bg-gray-300" />
                    </div>
                  </div>
                  <div className="w-full md:w-3/5">
                    <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={post.title.rendered}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-white to-gray-100" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Regular Posts Grid */}
        {regularPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularPosts.map((post) => {
              const imageUrl =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                extractFirstImageUrl(post.content.rendered);

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3 shadow-lg">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={post.title.rendered}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-white to-gray-100" />
                    )}
                  </div>
                  <h3
                    className="text-base font-semibold text-gray-800 mb-2 group-hover:text-[#44FF90] transition-colors line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: post.title.rendered,
                    }}
                  />
                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <p>{post._embedded?.author?.[0]?.name}</p>
                    <span>•</span>
                    <p>{new Date(post.date).toLocaleDateString()}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {featuredPosts.length === 0 && regularPosts.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No blog posts yet. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}