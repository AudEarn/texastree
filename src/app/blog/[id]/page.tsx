// 'use client'
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { fetchPost } from "@/services/wordpress";
// import { Home } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
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
// }

// const BlogPost = () => {
//     const router = useRouter();
//     const {id} = useParams();
//   const [post, setPost] = useState<WordPressPost | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     const loadPost = async () => {
//       if (!id) return;

//       try {
//         const fetchedPost = await fetchPost(Number(id));
//         setPost(fetchedPost);
//       } catch (error) {
//         console.error("Error loading post:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load blog post",
//           variant: "destructive",
//         });
//         router.push("/blog"); // Redirect to blog list on error
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadPost();
//   }, [id, toast, router]);

//   const extractFirstImageUrl = (content: string) => {
//     const imgRegex = /<img[^>]+src="([^">]+)"/;
//     const match = content.match(imgRegex);
//     return match ? match[1] : null;
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-800">Loading post...</div>
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-800">Post not found</div>
//       </div>
//     );
//   }

//   const imageUrl =
//     post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
//     extractFirstImageUrl(post.content.rendered);

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Home Button */}
//         <Button
//           variant="ghost"
//           className="mb-12 hover:bg-white/50 text-gray-800"
//           onClick={() => router.push("/blog")}
//         >
//           <Home className="h-4 w-4 mr-2" />
//           Return to Blog
//         </Button>

//         {/* Featured Image */}
//         {imageUrl && (
//           <div className="aspect-[16/9] rounded-lg overflow-hidden mb-8 shadow-lg">
//             <img
//               src={imageUrl}
//               alt={post.title.rendered}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         )}

//         {/* Post Content */}
//         <article className="prose max-w-none">
//           <h1
//             className="text-4xl font-bold text-gray-800 mb-4"
//             dangerouslySetInnerHTML={{ __html: post.title.rendered }}
//           />

//           <div className="text-sm text-gray-600 mb-8 flex items-center gap-2">
//             <p>{post._embedded?.author?.[0]?.name}</p>
//             <span>•</span>
//             <p>{new Date(post.date).toLocaleDateString()}</p>
//           </div>

//           <div
//             className="text-gray-700 prose-headings:text-gray-800 prose-a:text-blue-600 prose-strong:text-gray-800"
//             dangerouslySetInnerHTML={{ __html: post.content.rendered }}
//           />
//         </article>
//       </div>
//     </div>
//   );
// };

// export default BlogPost;


import { Button } from "@/components/ui/button";
import { fetchPost } from "@/services/wordpress";
import { Home } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

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
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
    author?: Array<{
      name: string;
    }>;
  };
}

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(Number(params.id));
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title.rendered} | Blog`,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
  };
}

const extractFirstImageUrl = (content: string) => {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : null;
};

export default async function BlogPost({ params }: Props) {
  const post = await fetchPost(Number(params.id));

  if (!post) {
    notFound();
  }

  const imageUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    extractFirstImageUrl(post.content.rendered);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Home Button */}
        <Link href="/blog">
          <Button
            variant="ghost"
            className="mb-12 hover:bg-white/50 text-gray-800"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Blog
          </Button>
        </Link>

        {/* Featured Image */}
        {imageUrl && (
          <div className="aspect-[16/9] rounded-lg overflow-hidden mb-8 shadow-lg">
            <Image
              height={300}
              width={300}
              src={imageUrl}
              alt={post.title.rendered}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <article className="prose max-w-none">
          <h1
            className="text-4xl font-bold text-gray-800 mb-4"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <div className="text-sm text-gray-600 mb-8 flex items-center gap-2">
            <p>{post._embedded?.author?.[0]?.name}</p>
            <span>•</span>
            <p>{new Date(post.date).toLocaleDateString()}</p>
          </div>

          <div
            className="text-gray-700 prose-headings:text-gray-800 prose-a:text-blue-600 prose-strong:text-gray-800"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </article>
      </div>
    </div>
  );
}