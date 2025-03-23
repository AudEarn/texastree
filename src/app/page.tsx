// 'use client'
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/components/home/Hero";
import { FeaturedCities } from "@/components/home/FeaturedCities";
import { Features } from "@/components/home/Features";
import { AdminControls } from "@/components/home/AdminControls";
// import { AdminControls } from "@/components/home/AdminControls";

const Index = () => {
  // Check if user is admin
//   const { data: profile } = useQuery({
//     queryKey: ["profile"],
//     queryFn: async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return null;
      
//       const { data } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", user.id)
//         .single();
      
//       return data;
//     },
//   });

  return (
    <div className="flex flex-col">
      {/* Admin Controls */}
      {/* {profile?.is_admin && <AdminControls />} */}
      <AdminControls />

      {/* Hero Section */}
      <Hero />

      {/* Featured Cities */}
      <FeaturedCities />

      {/* Why Choose Us */}
      <Features />
    </div>
  );
};

export default Index;