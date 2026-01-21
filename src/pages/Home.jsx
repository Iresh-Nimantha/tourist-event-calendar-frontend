import React, { useState, useEffect } from "react";
import CalendarView from "../components/CalendarView";
import { Search, Flame, Phone, Mail, Calendar, Filter, X } from "lucide-react";
import EventCard from "../components/EventCard";
import EventHotelDetailsModal from "../components/EventHotelDetailsModal";
import { eventsApi } from "../services/api";
import Footer from "@/components/Footer";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEventHotel, setSelectedEventHotel] = useState(null);
  const [selectedCity, setSelectedCity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsApi.getEvents({ city: "Bentota" });
      setEvents(res.data.events || res.data);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventDetails = async (eventId) => {
    try {
      const res = await eventsApi.getEventDetails(eventId);
      setSelectedEventHotel(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load event details");
    }
  };

  const closeModal = () => setSelectedEventHotel(null);

  const cities = [
    "all",
    ...new Set(events.map((e) => e.location?.city).filter(Boolean)),
  ];

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity =
      selectedCity === "all" || e.location?.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sri Lanka Event Calendar
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10">
            Explore hotel events, cultural festivals, and unforgettable
            experiences across Sri Lanka.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 rounded-xl bg-white text-blue-700 font-medium hover:bg-blue-50 transition">
              <Phone className="inline w-4 h-4 mr-2" />
              Call
            </button>

            <button className="px-6 py-3 rounded-xl bg-white text-blue-700 font-medium hover:bg-blue-50 transition">
              <Mail className="inline w-4 h-4 mr-2" />
              Email
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("calendar-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              <Calendar className="inline w-4 h-4 mr-2" />
              View Calendar
            </button>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="container mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border rounded-xl flex items-center gap-2 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filter by City</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-lg text-sm border transition ${
                      selectedCity === city
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {city === "all" ? "All Cities" : city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* CALENDAR */}
          <section
            id="calendar-section"
            className="lg:col-span-2 bg-white rounded-2xl shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Event Calendar
            </h2>
            <CalendarView />
          </section>

          {/* EVENTS SIDEBAR */}
          <aside className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Popular Events
            </h3>

            {loading ? (
              <p className="text-gray-500">Loading events...</p>
            ) : filteredEvents.length ? (
              <div className="space-y-4">
                {filteredEvents.slice(0, 3).map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onDetails={handleEventDetails}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events found</p>
            )}
          </aside>
        </div>
      </main>

      {/* MODAL */}
      <EventHotelDetailsModal
        open={!!selectedEventHotel}
        onClose={closeModal}
        data={selectedEventHotel}
      />

      <Footer />
    </div>
  );
};

export default Home;
