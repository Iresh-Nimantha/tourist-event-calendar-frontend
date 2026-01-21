import React from "react";
import { MapPin, Clock, DollarSign, ArrowRight } from "lucide-react";

const EventCard = ({ event, onDetails }) => {
  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
      <div className="space-y-3">
        {/* Event Title */}
        <h5 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h5>

        {/* Event Details */}
        <div className="space-y-2">
          {/* Location */}
          {event.location?.venue && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-sm font-medium line-clamp-1">
                {event.location.venue}
              </span>
            </div>
          )}

          {/* Time */}
          {event.startTime && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1.5 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <Clock className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="text-sm font-medium">{event.startTime}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <span className="text-base font-bold text-indigo-600">
              {event.price ? `LKR ${event.price}` : "Free"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onDetails(event._id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md group-hover:shadow-xl mt-4"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default EventCard;
