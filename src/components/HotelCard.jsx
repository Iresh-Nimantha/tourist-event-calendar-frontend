import { MapPin, Star, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const HotelCard = ({ hotel, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 ${className}`}
    >
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {hotel.location.region}
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-1 pr-4">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-5 h-5 fill-current" />
            <span className="text-sm font-semibold">4.8</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          {hotel.location.city}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">
          {hotel.description}
        </p>
        <div className="flex gap-3">
          {hotel.bookingUrl && (
            <Button
              asChild
              size="sm"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700"
            >
              <a
                href={hotel.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Book Now
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1">
            View Events
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
