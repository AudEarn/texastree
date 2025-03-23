import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number | null;
  size?: number;
}

export const StarRating = ({ rating, size = 16 }: StarRatingProps) => {
  if (!rating) return null;

  const stars = [];
  const fullStars = Math.floor(rating);
  const decimalPart = rating % 1;
  const hasHalfStar = decimalPart >= 0.3 && decimalPart < 0.7;
  const hasFullStar = decimalPart >= 0.7;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars || (i === fullStars && hasFullStar)) {
      stars.push(
        <Star 
          key={i} 
          className="text-yellow-500 fill-yellow-500" 
          size={size}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className="text-gray-300" size={size} />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="text-yellow-500 fill-yellow-500" size={size} />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star 
          key={i} 
          className="text-gray-300" 
          size={size}
        />
      );
    }
  }

  return <div className="flex">{stars}</div>;
};