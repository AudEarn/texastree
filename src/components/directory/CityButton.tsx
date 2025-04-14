import Link from "next/link";


interface CityButtonProps {
  cityName: string;
}

export const CityButton = ({ cityName }: CityButtonProps) => {
  const getBackgroundImage = (city: string) => {
    switch (city.toLowerCase()) {
      case "houston":
        return "url('/images/cities/houston.png')";
      case "dallas":
        return "url('/images/cities/dallas.png')";
      case "austin":
        return "url('/images/cities/austin.png')";
      default:
        return "none";
    }
  };

  const isSpecialCity = ["Houston", "Dallas", "Austin"].includes(cityName);

  return (
    <Link
      href={`/directory/${cityName}`}
      className={`
        block rounded-lg transition-all text-center shadow-lg hover:shadow-xl
        ${isSpecialCity ? 'h-48' : 'bg-white border border-gray-200 hover:border-forest-600 p-3'}
      `}
      style={isSpecialCity ? {
        backgroundImage: getBackgroundImage(cityName),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      } : undefined}
    >
      {isSpecialCity ? (
        <>
          <div
            className="absolute inset-0 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-30 transition-all"
            style={{ backdropFilter: 'blur(1px)' }}
          />
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              Tree Services in
            </span>
            <span className="text-3xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {cityName}, TX
            </span>
          </div>
        </>
      ) : (
        <span className="text-sm text-gray-800 hover:text-forest-600">
          {cityName}
        </span>
      )}
    </Link>
  );
};