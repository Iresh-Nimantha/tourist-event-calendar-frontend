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

const EventHotelDetailsModal = ({ open, onClose, data }) => {
  if (!open || !data) return null;

  const { event, hotel } = data;

  console.log("Modal render event:", event);
  console.log("Modal render hotel:", hotel);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* HEADER */}
        <div className="bg-blue-600 text-white p-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{event.title}</h2>
            <p className="text-blue-100 text-sm">
              {new Date(event.date).toDateString()}
            </p>
          </div>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* EVENT IMAGE */}
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-60 object-cover rounded-xl"
            />
          )}

          {/* EVENT DETAILS */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Event Details</h3>
            <p className="text-gray-700">{event.description}</p>

            <div className="flex gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {event.startTime} - {event.endTime}
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <DollarSign className="w-4 h-4" />
                {event.price ? `LKR ${event.price}` : "Free"}
              </span>
            </div>
          </div>

          {/* HOTEL */}
          {hotel && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Hotel Information</h3>

              {hotel.imageUrl && (
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              )}

              <p className="font-bold text-gray-900">{hotel.name}</p>
              <p className="text-gray-600 text-sm">{hotel.description}</p>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4" />
                  {hotel.location.address}, {hotel.location.city}
                </div>

                <div className="flex gap-2">
                  <Phone className="w-4 h-4" />
                  {hotel.phone}
                </div>

                <div className="flex gap-2">
                  <Mail className="w-4 h-4" />
                  {hotel.email}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-2 mt-4">
                <a
                  href={hotel.websiteUrl}
                  target="_blank"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  <Globe className="inline w-4 h-4 mr-1" /> Website
                </a>

                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  <Calendar className="inline w-4 h-4 mr-1" /> Book
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${hotel.location.address}, ${hotel.location.city}`,
                  )}`}
                  target="_blank"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  <MapPin className="inline w-4 h-4 mr-1" /> Directions
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventHotelDetailsModal;
