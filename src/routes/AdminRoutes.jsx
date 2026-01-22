// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import HotelsList from "../pages/admin/HotelsList";
import HotelForm from "../pages/admin/HotelForm";
import EventsList from "../pages/admin/EventsList";
import EventForm from "../pages/admin/EventForm";

const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="hotels" element={<HotelsList />} />
      <Route path="hotels/new" element={<HotelForm />} />
      <Route path="hotels/:id" element={<HotelForm />} />
      <Route path="events" element={<EventsList />} />
      <Route path="events/new" element={<EventForm />} />
      <Route path="events/:id" element={<EventForm />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </AdminLayout>
);

export default AdminRoutes;
