import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HotelDetail from "./pages/HotelDetail";
import { Toaster } from "react-hot-toast";
import React, { Suspense } from "react";

// Lazy load ChatBubble
import ChatBubble from "./components/ChatBot";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
        </Routes>

        <Toaster position="top-right" />

        {/* ChatBubble */}
        <ChatBubble />
      </div>
    </BrowserRouter>
  );
}

export default App;
