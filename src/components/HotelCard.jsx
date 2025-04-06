import { MapPin, Star } from "lucide-react";
import { Link } from "react-router";

function HotelCard({ hotel, confidence }) {
  return (
    <Link
      to={`/hotels/${hotel._id}`}
      key={hotel._id}
      className="block group relative transition-all duration-300 hover:shadow-xl rounded-xl bg-white border border-gray-200 hover:border-purple-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="object-cover w-full h-full absolute transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <h3 className="font-semibold text-lg text-purple-700 group-hover:underline line-clamp-1">
          {hotel.name}
        </h3>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1 text-purple-400" />
          <span className="line-clamp-1">{hotel.location}</span>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center text-sm space-x-2">
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-yellow-400 mr-1" />
            <span className="font-medium">{hotel?.rating ?? "N/A"}</span>
          </div>
          <span className="text-gray-400">
            ({hotel.reviews?.toLocaleString() ?? "0"} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-1">
          <span className="text-xl font-bold text-purple-700">${hotel.price}</span>
          <span className="text-sm text-gray-400">/night</span>
        </div>

        {/* Confidence */}
        {typeof confidence === "number" && (
          <div className="text-xs text-gray-500">
            Confidence: <span className="font-semibold text-purple-600">{(confidence * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default HotelCard;