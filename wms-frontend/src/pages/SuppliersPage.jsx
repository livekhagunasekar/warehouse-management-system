import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/suppliers/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSuppliers(res.data))
      .catch((err) =>
        console.error("Error fetching suppliers:", err.response?.data || err)
      );
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/suppliers/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(suppliers.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting supplier:", err.response?.data || err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">🧾 Suppliers</h1>
        <button
          onClick={() => navigate('/dashboard/suppliers/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Supplier
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              {/* <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Address</th> */}
              <th className="px-5 py-3 text-left">Contact Info</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3 text-left">{s.name}</td>
                {/* <td className="px-4 py-2">{s.email || "-"}</td>
                <td className="px-4 py-2">{s.address || "-"}</td> */}
                <td className="px-5 py-3 text-left">{s.contact_info || "-"}</td>
                <td className="px-5 py-3 text-left space-x-2">
                  <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/dashboard/suppliers/edit/${s.id}`)}
                        title="Edit User"
                        className="bg-blue-500 hover:bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded"
                    >
                        🖉
                    </button>

                    <button
                        onClick={() => handleDelete(s.id)}
                        title="Delete User"
                        className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded"
                    >
                        🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {suppliers.length === 0 && (
          <div className="p-4 text-gray-500 text-center">No suppliers found.</div>
        )}
      </div>
    </div>
  );
}
