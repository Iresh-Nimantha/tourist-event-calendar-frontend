// src/pages/admin/HotelsList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hotelApi } from "../../services/api";
import { toast } from "react-hot-toast";

const HotelsList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const res = await hotelApi.getMyHotels();
        setHotels(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load hotels");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

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
        <h2 className="text-2xl font-bold">All Hotels</h2>
        <Link
          to="/admin/hotels/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add New Hotel
        </Link>
      </div>
      {hotels.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hotels found. Create your first hotel to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200 bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">Name</th>
                <th className="border px-4 py-3 text-left">City</th>
                <th className="border px-4 py-3 text-left">Region</th>
                <th className="border px-4 py-3 text-left">Phone</th>
                <th className="border px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 font-medium">{hotel.name}</td>
                  <td className="border px-4 py-3">
                    {hotel.location?.city || "N/A"}
                  </td>
                  <td className="border px-4 py-3">
                    {hotel.location?.region || "N/A"}
                  </td>
                  <td className="border px-4 py-3">
                    {hotel.phone || "N/A"}
                  </td>
                  <td className="border px-4 py-3">
                <Link
                  to={`/admin/hotels/${hotel._id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium mr-3"
                >
                  Edit
                </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HotelsList;
