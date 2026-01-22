import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventApi } from "../../services/api";
import { toast } from "react-hot-toast";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await eventApi.getMyEvents();
        setEvents(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await eventApi.deleteEvent(id);
      toast.success("Event deleted successfully");
      setEvents(events.filter((e) => e._id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Events</h2>
        <Link
          to="/admin/events/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Create New Event
        </Link>
      </div>
      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No events found. Create your first event to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event._id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
              <div className="text-xs text-gray-500 mb-3">
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
                <p><strong>Location:</strong> {event.location?.city}</p>
                <p><strong>Price:</strong> {event.price === 0 ? "Free" : `Rs. ${event.price}`}</p>
                <p><strong>Status:</strong> {event.isPublished ? "Published" : "Draft"}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/admin/events/${event._id}`}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="text-red-600 hover:underline text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;

