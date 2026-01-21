import { X, MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import HotelCard from "./HotelCard";
import { useNavigate } from "react-router-dom";

const EventModal = ({ event, onClose }) => {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.location.venue}, {event.location.city}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {event.startTime} - {event.endTime || "Late"}
            </div>
            {event.price > 0 && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                LKR {event.price.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <div className="p-6 space-y-6">
          <img
            src={event.imageUrl || "/placeholder-event.jpg"}
            alt={event.title}
            className="w-full h-64 object-cover rounded-2xl shadow-lg"
          />
          <div className="prose max-w-none">
            <p>{event.description}</p>
          </div>
          {event.hotelId && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Hosted by
              </h3>
              <HotelCard hotel={event.hotelId} />
            </div>
          )}
        </div>
        <div className="p-6 pt-0 border-t bg-gray-50/50 rounded-b-3xl">
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700"
              onClick={() => navigate(`/hotel/${event.hotelId?._id}`)}
            >
              View Hotel & Book
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Add to Calendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
