import axios from "axios";

// Base API URL
const API_BASE = import.meta.env.VITE_API_URL;

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
// Response interceptor: handle 401
// =========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = '/login'; // Uncomment if you have login page
    }
    return Promise.reject(error);
  },
);

// =========================
// Events API
// =========================
export const eventsApi = {
  getEvents: (filters) => api.get("/events", { params: filters }),
  getEventDetails: (eventId) => api.get(`/event-details/${eventId}`),
};

// =========================
// Hotels API
// =========================
export const hotelsApi = {
  getHotels: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.city) params.append("city", filters.city);
    if (filters.region) params.append("region", filters.region);
    if (filters.category) params.append("category", filters.category);
    return api.get(`/hotels?${params.toString()}`);
  },
  getHotelById: (id) => api.get(`/hotels/${id}`),
  searchHotels: (query) => api.get(`/hotels/search?q=${query}`),
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
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

// Export default axios instance
export default api;
