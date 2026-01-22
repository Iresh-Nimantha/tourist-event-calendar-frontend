import React, { useEffect, useState } from "react";
import { hotelsApi, eventsApi } from "@/services/api";
import { MapPin, Phone, Globe, Calendar, Star } from "lucide-react";
import EventCard from "../components/EventCard";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const HotelDetailModal = ({ hotelId, onClose }) => {
  const [hotel, setHotel] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotelId) {
      fetchHotel();
      fetchHotelEvents();
    }
  }, [hotelId]);

  const fetchHotel = async () => {
    try {
      const { data } = await hotelsApi.getHotel(hotelId);
      setHotel(data);
    } catch (error) {
      toast.error("Hotel not found");
      onClose();
    }
  };

  const fetchHotelEvents = async () => {
    try {
      const { data } = await eventsApi.getEvents({
        hotelId,
        from: new Date().toISOString().split("T")[0],
      });
      const eventsArray = Array.isArray(data)
        ? data
        : data?.events || data?.data || [];
      setEvents(eventsArray);
    } catch (error) {
      console.error("Events fetch error:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (!hotel || loading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-y-auto max-h-[90vh] p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ✕
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Hotel Info */}
          <div className="lg:w-1/3 space-y-4">
            <img
              src={hotel.imageUrl || "/hotel-placeholder.jpg"}
              alt={hotel.name}
              className="w-full h-48 object-cover rounded-2xl shadow-lg"
            />
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="flex items-center gap-2 text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span>4.8</span>
              <span className="text-gray-500">(248 reviews)</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  {hotel.location.city}, {hotel.location.region}
                  {hotel.location.address && (
                    <p className="text-sm text-gray-500">
                      {hotel.location.address}
                    </p>
                  )}
                </div>
              </div>

              {hotel.phone && (
                <a
                  href={`tel:${hotel.phone}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Phone className="w-5 h-5 text-blue-600" />
                  {hotel.phone}
                </a>
              )}

              {hotel.bookingUrl && (
                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700"
                >
                  <Globe className="w-5 h-5" /> Book Now
                </a>
              )}
            </div>
          </div>

          {/* Right: Events */}
          <div className="lg:w-2/3 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Upcoming Events ({events.length})
            </h3>

            {events.length > 0 ? (
              events.map((event) => <EventCard key={event._id} event={event} />)
            ) : (
              <p className="text-gray-500">
                No upcoming events for this hotel.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HotelDetailModal;
