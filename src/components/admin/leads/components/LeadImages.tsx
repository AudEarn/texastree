interface LeadImagesProps {
  images: string[];
}

export const LeadImages = ({ images }: LeadImagesProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Images</h3>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image: string, index: number) => {
          let imageUrl = image;
          
          // If it's not a full URL, construct the Supabase storage URL
          if (!image.startsWith('http')) {
            imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/quote-request-images/${image}`;
          }

          return (
            <div key={index} className="relative">
              <a 
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={imageUrl}
                  alt={`Lead image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};