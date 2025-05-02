"use client"
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";


interface Business {
  business_name: string;
  logo_url?: string;
}

interface FeaturedImageProps {
  business: Business;
  images: string[];
}

export default function FeaturedImage({
  business,
  images,
}: FeaturedImageProps) {
  const [featureImage, setFeatureImage] = useState(images[0]);

  console.log({featureImage})
  return (
    <div className="">
      <div className="relative w-full md:w-[400px] h-[300px] md:h-[400px] rounded-xl overflow-hidden group">
        {/* Golden frame effect */}
        <div className="absolute inset-0 border-2 border-amber-200 rounded-xl z-30 pointer-events-none"></div>
        
        <div className="absolute inset-0 shadow-lg z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-20"></div>
        
        <Image
          width={400}
          height={400}
          src={featureImage?.includes('http') ? featureImage : `https://preview--treehub-automation.lovable.app${featureImage}`}
          alt={`${business.business_name} featured image`}
className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Premium badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg z-30 flex items-center">
          <Star className="w-4 h-4 mr-1 fill-white" />
          PREMIUM
        </div>

        {/* Business logo */}
        {business.logo_url && (
          <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg z-30">
            <Image
              width={80}
              height={80}
              src={`https://preview--treehub-automation.lovable.app${business.logo_url}`}
              alt={`${business.business_name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* 👉 Thumbnails */}
      <div className="flex gap-2 mt-4 w-full md:w-[400px]">
        {images.map((img: string, index: number) => (
          <div
            key={index}
            onClick={() => setFeatureImage(img)}
            className={`w-full h-20 cursor-pointer rounded-xl overflow-hidden border-2 ${
              img === featureImage ? "border-amber-500" : "border-transparent"
            }`}
          >
            <Image
              width={80}
              height={80}
            //   src={`https://preview--treehub-automation.lovable.app${img}`}
              src={img?.includes('http') ? img : `https://preview--treehub-automation.lovable.app${img}`}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
