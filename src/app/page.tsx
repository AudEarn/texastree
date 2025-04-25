// 'use client'
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
import { AdminControls } from "@/components/home/AdminControls";
import { FeaturedCities } from "@/components/home/FeaturedCities";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { MostPopulatedCities } from "@/components/home/MostPopulatedCities";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
// import bgVideo from "/public/videos/bg-video.mp4";
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

      {/* i want to make vedio running background of this div. that will play infinite. can you please  */}
      {/* make it */}
      {/* <div className="relative w-full h-screen overflow-hidden">
        <video
          className="border border-red-800 top-0 left-0 w-full h-[500px] object-cover"
          autoPlay
          loop
          muted
        >
          <source src="/public/videos/bg-video.mp4" type="video/mp4" />
        </video>
      </div> */}
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-[#1147286f] -z-[9]" />

        <AdminControls />

        {/* Hero Section */}
        <Hero />

        {/* Featured Cities */}
      </div>

      <FeaturedCities />

      {/* Top 15 Popular Cities */}
      <MostPopulatedCities />
      
      {/* Features */}
      <Features />

      {/* Why Choose Us */}
      {/* <WhyChooseUs /> */}
    </div>
  );
};

export default Index;
