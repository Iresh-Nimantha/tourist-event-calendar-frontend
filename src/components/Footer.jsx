import React from "react";
import { Phone, Mail } from "lucide-react";

const Footer = () => {
  const handleContactCall = () => {
    window.location.href = "tel:+94112345678";
  };

  const handleContactEmail = () => {
    window.location.href = "mailto:info@srilankaevents.lk";
  };

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="text-center md:text-left max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Need Assistance?
            </h3>
            <p className="text-gray-600 text-sm">
              Contact us for event details, hotel inquiries, or booking support.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleContactCall}
              className="flex items-center gap-3 px-6 py-3 border rounded-xl text-gray-700 hover:bg-gray-50 transition"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="font-medium">+94 11 234 5678</span>
            </button>

            <button
              onClick={handleContactEmail}
              className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <Mail className="w-4 h-4" />
              <span className="font-medium">Email Us</span>
            </button>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 pt-6 border-t text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Sri Lanka Events Calendar. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
