import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InboundList() {
  const [inbounds, setInbounds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInbounds = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/inbounds/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInbounds(response.data);
      } catch (err) {
        console.error("Error fetching inbound data:", err);
      }
    };

    fetchInbounds();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inbound Entries</h1>
        <button
          onClick={() => navigate("/dashboard/inbound/add")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          ➕ Add Inbound
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Supplier</th>
            <th className="border px-4 py-2">Reference</th>
            <th className="border px-4 py-2">Received Date</th>
          </tr>
        </thead>
        <tbody>
          {inbounds.map((inbound) => (
            <tr key={inbound.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{inbound.product_name}</td>
              <td className="border px-4 py-2">{inbound.quantity}</td>
              <td className="border px-4 py-2">{inbound.supplier_name}</td>
              <td className="border px-4 py-2">{inbound.invoice_number}</td>
              <td className="border px-4 py-2">
                {new Date(inbound.received_date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-gray-500 mt-4">{inbounds.length} inbounds</p>
    </div>
  );
}
