import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { eventApi, hotelApi } from "../../services/api";
import ImageUpload from "../../components/ImageUpload";
import { toast } from "react-hot-toast";

const EventForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [formData, setFormData] = useState({
    hotelId: "",
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: {
      venue: "",
      city: "",
      region: "",
    },
    category: "cultural",
    imageUrl: "",
    price: 0,
    isPublished: true,
  });

  const categories = [
    "cultural",
    "festival",
    "nightlife",
    "adventure",
    "food",
    "wellness",
    "music",
    "other",
  ];

  useEffect(() => {
    // Load all user's hotels
    const loadHotels = async () => {
      try {
        const response = await hotelApi.getMyHotels();
        const hotelsData = Array.isArray(response.data) ? response.data : [];
        setHotels(hotelsData);

        if (hotelsData.length === 0) {
          toast.error("Please create a hotel profile first");
          navigate("/admin/hotels/new");
          return;
        }

        // Set default hotel from URL params or first hotel
        const hotelIdFromUrl = searchParams.get("hotelId");
        const defaultHotelId = hotelIdFromUrl || hotelsData[0]?._id;
        if (defaultHotelId) {
          setFormData((prev) => ({ ...prev, hotelId: defaultHotelId }));
          
          // Pre-fill location from selected hotel
          const selectedHotel = hotelsData.find(h => h._id === defaultHotelId);
          if (selectedHotel?.location) {
            setFormData((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                city: selectedHotel.location.city || "",
                region: selectedHotel.location.region || "",
              },
            }));
          }
        }
      } catch (error) {
        console.error("Error loading hotels:", error);
        toast.error("Failed to load hotels");
      }
    };

    loadHotels();

    // Load event if editing
    if (id && id !== "new") {
      const fetchEvent = async () => {
        try {
          const response = await eventApi.getEventById(id);
          const event = response.data;
          setFormData({
            hotelId: event.hotelId?._id || event.hotelId || "",
            title: event.title || "",
            description: event.description || "",
            date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
            startTime: event.startTime || "",
            endTime: event.endTime || "",
            location: {
              venue: event.location?.venue || "",
              city: event.location?.city || "",
              region: event.location?.region || "",
            },
            category: event.category || "cultural",
            imageUrl: event.imageUrl || "",
            price: event.price || 0,
            isPublished: event.isPublished !== undefined ? event.isPublished : true,
          });
        } catch (error) {
          console.error("Error fetching event:", error);
          toast.error("Failed to load event data");
        }
      };
      fetchEvent();
    }
  }, [id, navigate, searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [field]: value,
        },
      });
    } else if (name === "hotelId") {
      // When hotel changes, optionally update location
      const selectedHotel = hotels.find(h => h._id === value);
      setFormData({
        ...formData,
        hotelId: value,
        location: {
          ...formData.location,
          city: selectedHotel?.location?.city || formData.location.city,
          region: selectedHotel?.location?.region || formData.location.region,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.hotelId) {
      toast.error("Please select a hotel");
      return;
    }

    setLoading(true);

    try {
      if (id && id !== "new") {
        await eventApi.updateEvent(id, formData);
        toast.success("Event updated successfully!");
      } else {
        await eventApi.createEvent(formData);
        toast.success("Event created successfully!");
      }
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error(error.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading hotels...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          {id === "new" ? "Create New Event" : "Edit Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hotel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Hotel <span className="text-red-500">*</span>
            </label>
            <select
              name="hotelId"
              value={formData.hotelId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">-- Select a Hotel --</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name} - {hotel.location?.city}, {hotel.location?.region}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              label="Event Image"
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your event..."
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  name="location.venue"
                  value={formData.location.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Event venue or location name"
                />
                <p className="text-xs text-gray-500 mt-1">Optional: Separate venue from hotel</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location.region"
                  value={formData.location.region}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Region/Province"
                />
              </div>
            </div>
          </div>

          {/* Price & Publish */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Rs.)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Enter 0 for free events</p>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Publish Event</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : id === "new" ? "Create Event" : "Update Event"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
