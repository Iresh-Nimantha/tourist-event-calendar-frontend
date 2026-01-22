import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Star, Calendar } from "lucide-react";

const HotelDetailsModal = ({ hotel, events, onClose }) => {
  if (!hotel && !events.length) return null;

  const event = events[0]; // Single event for modal

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        {/* Event Info */}
        {event && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-2">
              {new Date(event.date).toDateString()}
            </p>
            <p className="text-gray-800">{event.description}</p>
          </div>
        )}

        {/* Hotel Info */}
        {hotel && (
          <div className="bg-gray-50 p-4 rounded-2xl">
            <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>{hotel.rating || 4.5}</span>
            </div>
            <p className="text-gray-600">
              {hotel.location.city}, {hotel.location.region}
            </p>
            {hotel.phone && <p>Phone: {hotel.phone}</p>}
            {hotel.bookingUrl && (
              <Button
                onClick={() => window.open(hotel.bookingUrl, "_blank")}
                className="mt-4"
              >
                Visit Hotel Website
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HotelDetailsModal;
