import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OutboundsPage() {
  const [outbounds, setOutbounds] = useState([]);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/outbounds/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOutbounds(res.data))
      .catch((err) => {
        console.error("Error fetching outbounds:", err.response?.data || err);
      });
  }, [token]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">📤 Outbound Records</h1>
        <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate('/dashboard/outbounds/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Outbound
        </button>
      </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left">Product</th>
              <th className="px-5 py-3 text-center">Qty</th>
              <th className="px-5 py-3 text-left">Customer</th>
              <th className="px-5 py-3 text-left">SO Ref</th>
              <th className="px-5 py-3 text-center">Dispatched</th>
              <th className="px-5 py-3 text-left">Created By</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {outbounds.map((o) => (
              <tr
                key={o.id}
                className="hover:bg-gray-50 transition duration-200 ease-in-out"
              >
                <td className="px-5 py-3">{o.product_name}</td>
                <td className="px-5 py-3 text-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                    {o.quantity}
                  </span>
                </td>
                <td className="px-5 py-3">{o.customer}</td>
                <td className="px-5 py-3">{o.so_reference}</td>
                <td className="px-5 py-3 text-center">{o.dispatched_date}</td>
                <td className="px-5 py-3">{o.created_by_username}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {outbounds.length === 0 && (
          <div className="p-6 text-gray-500 text-center">No outbound records found.</div>
        )}
      </div>
    </div>
  );
}
