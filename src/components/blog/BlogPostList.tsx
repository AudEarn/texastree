import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BlogPost } from "@/types/blog";
import { Pencil, Trash2 } from "lucide-react";

interface BlogPostListProps {
  posts: BlogPost[];
  isAdmin: boolean;
  startEditing: (post: BlogPost) => void;
  deletePost: (id: string) => void;
}

export const BlogPostList = ({
  posts,
  isAdmin,
  startEditing,
  deletePost,
}: BlogPostListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="bg-black/50 backdrop-blur-sm border border-[#44FF90]/20 overflow-hidden"
        >
          <div className="relative h-48 overflow-hidden">
            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {post.title}
            </h2>
            <p className="text-gray-300 mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                <p>{post.author}</p>
                <p>{post.created_at.toLocaleDateString()}</p>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(post)}
                    className="hover:bg-white/10"
                  >
                    <Pencil className="h-4 w-4 text-[#44FF90]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePost(post.id)}
                    className="hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
