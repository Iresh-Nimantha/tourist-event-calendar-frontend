import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import HotelDetail from "./pages/HotelDetail";
import { Toaster } from "react-hot-toast";
import React, { Suspense } from "react";

// Lazy load ChatBubble
import ChatBubble from "./components/ChatBot";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
        {/* ChatBubble */}
        <ChatBubble />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />

          {/* Admin (Protected) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
          {/* Redirect /admin to /admin/dashboard */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Routes>

        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
