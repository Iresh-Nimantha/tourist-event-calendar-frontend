import axios from "axios";

// Base API URL - should NOT include /api prefix
// In production, set VITE_API_URL in your deployment platform's environment variables
// For Vercel: Add it in Project Settings > Environment Variables
// For Render/Netlify: Add it in Environment section
// IMPORTANT: VITE_API_URL should be like "http://localhost:5000" (without /api)
let API_BASE = import.meta.env.VITE_API_URL;

// If not set, use default for development
if (!API_BASE) {
  if (import.meta.env.DEV) {
    API_BASE = "http://localhost:5000";
    console.warn("VITE_API_URL not set, using default:", API_BASE);
  } else {
    console.error("VITE_API_URL is not set. Please configure it in your environment variables.");
    API_BASE = ""; // Will cause errors, but better than wrong URL
  }
}

// Remove trailing slash and /api if accidentally included
API_BASE = API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

// Log API base URL in development for debugging
if (import.meta.env.DEV) {
  console.log("API Base URL:", API_BASE);
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// =========================
// Request interceptor: attach token
// =========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =========================
// Response interceptor: handle 401 and log errors
// =========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log API errors for debugging
    if (error.config) {
      console.error(`API Error [${error.config.method?.toUpperCase()}] ${error.config.url}:`, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// =========================
// Events API (Public)
// =========================
export const eventsApi = {
  getEvents: (filters) => api.get("/api/events", { params: filters }),
  getEventDetails: (eventId) => api.get(`/api/event-details/${eventId}`),
};

// =========================
// Hotels API (Public)
// =========================
export const hotelsApi = {
  getHotels: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.city) params.append("city", filters.city);
    if (filters.region) params.append("region", filters.region);
    if (filters.category) params.append("category", filters.category);
    return api.get(`/api/hotels?${params.toString()}`);
  },
  getHotelById: (id) => api.get(`/api/hotels/${id}`),
  searchHotels: (query) => api.get(`/api/hotels/search?q=${query}`),
};

// =========================
// Bookings API
// =========================
export const bookingsApi = {
  getBookings: () => api.get("/bookings"),
  createBooking: (data) => api.post("/bookings", data),
};

// =========================
// Auth API
// =========================
export const authApi = {
  login: (credentials) => api.post("/api/auth/login", credentials),
  register: (userData) => api.post("/api/auth/register", userData),
  googleLogin: (credential) => api.post("/api/auth/google", { credential }),
  getMe: () => api.get("/api/auth/me"),
};

// =========================
// Hotel API (Admin) - Multiple hotels per user
// =========================
export const hotelApi = {
  getMyHotels: () => api.get("/api/me/hotels"),
  getMyHotelById: (id) => api.get(`/api/me/hotels/${id}`),
  createHotel: (data) => api.post("/api/me/hotels", data),
  updateHotel: (id, data) => api.put(`/api/me/hotels/${id}`, data),
  deleteHotel: (id) => api.delete(`/api/me/hotels/${id}`),
  getAllHotels: () => api.get("/api/admin/hotels"),
  getHotelById: (id) => api.get(`/api/hotels/${id}`),
};

// =========================
// Event API (Admin)
// =========================
export const eventApi = {
  getMyEvents: () => api.get("/api/me/events"),
  createEvent: (data) => api.post("/api/me/events", data),
  updateEvent: (id, data) => api.put(`/api/me/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/api/me/events/${id}`),
  getEventById: (id) => api.get(`/api/events/${id}`),
};

// Export default axios instance
export default api;
