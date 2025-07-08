import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InboundsPage() {
  const [inbounds, setInbounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInbounds = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/inbounds/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInbounds(response.data);
      } catch (error) {
        console.error("Error fetching inbounds:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInbounds();
  }, [token]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">📥 Inbound Records</h1>
        <button
          onClick={() => navigate('/dashboard/inbounds/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Inbound
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Quantity</th>
                <th className="px-5 py-3 text-left">Supplier</th>
                <th className="px-5 py-3 text-lef">Reference</th>
                <th className="px-5 py-3 text-center">Received Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {inbounds.map((inbound) => (
                <tr key={inbound.id}>
                  <td className="px-5 py-3">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() =>
                        navigate(`/dashboard/inbounds/edit/${inbound.id}`)
                      }
                    >
                      {inbound.product_name}
                    </button>
                  </td>
                  <td className=" text-blue-800 px-2 py-1 rounded text-xs font-semibold">{inbound.quantity}</td>
                  <td className="px-5 py-3">{inbound.supplier_name}</td>
                  <td className="px-5 py-3">{inbound.reference || "-"}</td>
                  <td className="px-5 py-3">
                    {new Date(inbound.received_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {inbounds.length === 0 && (
            <div className="p-4 text-gray-500 text-center">
              No inbound records found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
