import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, Calendar } from "lucide-react";

const EventHotelDetailsModal = ({ open, onClose, data }) => {
  if (!open || !data) return null;

  const { hotel, event } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-y-auto max-h-[90vh]"
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            ×
          </button>

          {/* Event Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="flex items-center gap-4 text-gray-700 mb-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(event.date).toLocaleDateString()} | {event.startTime}{" "}
                - {event.endTime}
              </span>
            </div>
            <p className="font-semibold">Category: {event.category}</p>
            <p className="font-semibold">Price: Rs {event.price}</p>
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-64 object-cover rounded-2xl mt-4"
              />
            )}
          </div>

          {/* Hotel Details */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
            <p className="text-gray-600 mb-2">{hotel.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5" />
                <span>
                  {hotel.location.address}, {hotel.location.city},{" "}
                  {hotel.location.region}
                </span>
              </div>
              {hotel.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-5 h-5" />
                  <span>{hotel.phone}</span>
                </div>
              )}
              {hotel.email && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-5 h-5" />
                  <span>{hotel.email}</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-4">
              {hotel.bookingUrl && (
                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
                >
                  Book Hotel
                </a>
              )}
              {hotel.websiteUrl && (
                <a
                  href={hotel.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-2xl hover:bg-gray-300 transition"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventHotelDetailsModal;
