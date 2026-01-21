import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { X, MapPin, Clock, DollarSign } from "lucide-react";
import { eventsApi } from "@/services/api";
import EventHotelDetailsModal from "./EventHotelDetailsModal";

const CalendarView = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Fetch calendar events
  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      console.log("Fetching calendar events...");
      setLoading(true);
      const res = await eventsApi.getEvents();
      console.log("Events response:", res.data);
      const events = res.data.events || res.data;
      const formatted = events.map((e) => ({
        title: e.title,
        date: new Date(e.date).toISOString().split("T")[0],
        extendedProps: e,
      }));
      setCalendarEvents(formatted);
    } catch (err) {
      console.error("Error fetching calendar events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (info) => {
    console.log("Date clicked:", info.dateStr);
    const dayEvents = calendarEvents
      .filter((e) => e.date === info.dateStr)
      .map((e) => e.extendedProps);
    console.log("Events on this date:", dayEvents);

    if (!dayEvents.length) return;

    setSelectedDate(info.dateStr);
    setSelectedDateEvents(dayEvents);
  };

  const closePanel = () => {
    setSelectedDate("");
    setSelectedDateEvents([]);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  if (loading)
    return (
      <div className="h-96 flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full" />
      </div>
    );

  return (
    <div className="relative">
      {/* Calendar */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          dateClick={handleDateClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          eventContent={(info) => (
            <div className="px-1 py-0.5 text-xs rounded bg-blue-50 text-blue-700 font-medium truncate">
              {info.event.title}
            </div>
          )}
          dayCellClassNames={(arg) =>
            calendarEvents.some(
              (e) => e.date === arg.date.toISOString().split("T")[0],
            )
              ? "cursor-pointer hover:bg-blue-50 transition"
              : "text-gray-400"
          }
        />
      </div>

      {/* Side Panel */}
      {selectedDateEvents.length > 0 && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={closePanel}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl overflow-y-auto transition-transform transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-blue-600 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">
                  {formatDate(selectedDate)}
                </h3>
                <p className="text-sm text-blue-100">
                  {selectedDateEvents.length} event(s)
                </p>
              </div>
              <button onClick={closePanel}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Events List */}
            <div className="p-5 space-y-4">
              {selectedDateEvents.map((event) => (
                <div
                  key={event._id}
                  className="border rounded-xl p-4 hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-lg mb-2">{event.title}</h4>

                  {event.location?.venue && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" /> {event.location.venue}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-sm">
                    {event.startTime && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" /> {event.startTime}
                      </div>
                    )}
                    <div className="flex items-center gap-1 font-semibold text-blue-600">
                      <DollarSign className="w-4 h-4" />{" "}
                      {event.price ? `LKR ${event.price}` : "Free"}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      console.log(
                        "View Full Details clicked for ID:",
                        event._id,
                      );
                      setSelectedEventId(event._id);
                    }}
                    className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                  >
                    View Full Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Event + Hotel Modal */}
      <EventHotelDetailsModal
        open={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
        eventId={selectedEventId}
      />
    </div>
  );
};

export default CalendarView;
