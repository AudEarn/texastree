"use client"

import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageMagnifierProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  zoomLevel?: number;
}

export default function ImageMagnifier({
  src,
  alt,
  width,
  height,
  className = "",
  zoomLevel = 2.5,
}: ImageMagnifierProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log(showMagnifier,
    showModal)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative cursor-zoom-in h-full"
        // onMouseEnter={() => setShowMagnifier(true)}
        // onMouseLeave={() => setShowMagnifier(false)}
        onMouseEnter={() => setShowModal(true)}
        // onMouseLeave={() => setShowModal(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setShowModal(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        //   onLoad={() => setImageLoaded(true)}
        />

        {showMagnifier && imageLoaded && (
          <div
            className="absolute pointer-events-none border-2 border-white rounded-full overflow-hidden shadow-lg"
            style={{
              width: "150px",
              height: "150px",
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 50,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: `${position.x}% ${position.y}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center4">
          <div className="relative  w-full h-[760px] bg-black/50 p-5 overflow-hidden">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 z-[1] right-5 text-white hover:text-gray-300 transition-colors bg-white rounded-full p-2"
            >
              <X className="w-8 h-8 text-black" />
            </button>
            {/* <div className="relative w-full h-auto max-w-4xl overflow-hidden"> */}
              <Image
                src={src}
                alt={alt}
                width={400}
                height={400}
                className="w-full h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            {/* </div> */}
          </div>
        </div>
      )}
    </>
  );
}
