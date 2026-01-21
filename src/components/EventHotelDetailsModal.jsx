import React, { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  Globe,
  Calendar,
  Mail,
} from "lucide-react";
import { eventsApi } from "@/services/api";

const EventHotelDetailsModal = ({ open, onClose, eventId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) {
      setData(null);
      setLoading(true);
      return;
    }
    if (eventId) fetchEventDetails(eventId);
  }, [open, eventId]);

  const fetchEventDetails = async (id) => {
    try {
      console.log("Fetching event details for ID:", id);
      setLoading(true);
      const res = await eventsApi.getEventDetails(id);
      console.log("Raw API response:", res.data);
      setData(res.data); // This has { event: {...}, hotel: {...} }
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Destructure event and hotel from data
  const event = data?.event;
  const hotel = data?.hotel;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-600 text-white p-5 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {event?.title || "Loading..."}
            </h2>
            <p className="text-blue-100 text-sm">{event?.date}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full" />
            </div>
          ) : event ? (
            <>
              {/* Event Image */}
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-60 object-cover rounded-lg"
                />
              )}

              {/* Event Details */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Event Details</h3>
                <p className="text-gray-700">
                  {event.description || "No description available"}
                </p>
                <div className="flex gap-4 text-sm text-gray-600">
                  {event.startTime && event.endTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {event.startTime} -{" "}
                      {event.endTime}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />{" "}
                    {event.price ? `${event.price} LKR` : "Free"}
                  </span>
                </div>
              </div>

              {/* Hotel Section */}
              {hotel && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Hotel Information
                  </h3>

                  {hotel.imageUrl && (
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}

                  <p className="font-semibold text-gray-800">{hotel.name}</p>
                  <p className="text-gray-600 text-sm">{hotel.description}</p>

                  <div className="grid grid-cols-1 gap-2 text-gray-700 text-sm">
                    {hotel.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 mt-1 text-gray-600" />
                        <div>
                          <p>{hotel.location.address}</p>
                          <p>
                            {hotel.location.city}, {hotel.location.region}
                          </p>
                        </div>
                      </div>
                    )}
                    {hotel.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <a
                          href={`tel:${hotel.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {hotel.phone}
                        </a>
                      </div>
                    )}
                    {hotel.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <a
                          href={`mailto:${hotel.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {hotel.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {hotel.websiteUrl && (
                      <a
                        href={hotel.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        <Globe className="w-4 h-4" /> Website
                      </a>
                    )}
                    {hotel.bookingUrl && (
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        <Calendar className="w-4 h-4" /> Book
                      </a>
                    )}
                    {hotel.location && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.location.address}, ${hotel.location.city}, ${hotel.location.region}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                      >
                        <MapPin className="w-4 h-4" /> Directions
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Event Location */}
              {event.location && (
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">
                    Event Location
                  </h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-medium">{event.location.venue}</p>
                      <p className="text-gray-700 text-sm">
                        {event.location.city}, {event.location.region}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-600 py-10">No data found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventHotelDetailsModal;
