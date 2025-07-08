import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CycleCountPage() {
  const [cycleCounts, setCycleCounts] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/cycle-counts/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCycleCounts(res.data))
      .catch((err) => {
        console.error("Error fetching cycle counts:", err);
      });
  }, [token]);

  const filtered = cycleCounts.filter((c) =>
    c.product_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">🔁 Cycle Count Records</h1>
        <button
          onClick={() => navigate('/dashboard/cycle-counts/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Cycle Count
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2 font-medium">Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product..."
            className="border px-3 py-1 rounded w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left">Product</th>
              <th className="px-5 py-3 text-left">Counted Qty</th>
              <th className="px-5 py-3 text-left">System Qty</th>
              <th className="px-5 py-3 text-left">Adjusted By</th>
              <th className="px-5 py-3 text-left">Adjusted At</th>
              <th className="px-5 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3">{c.product_name}</td>
                <td className="px-5 py-3">{c.counted_quantity}</td>
                <td className="px-5 py-3">{c.system_quantity}</td>
                <td className="px-5 py-3">{c.adjusted_by_username}</td>
                <td className="px-5 py-3">{new Date(c.adjusted_at).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <button
                        onClick={() => navigate(`/dashboard/cycle-counts/edit/${c.id}`)}
                        title="Edit User"
                        className="bg-blue-500 hover:bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded"
                    >
                        🖉
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-4 text-center text-gray-500">No cycle count records found.</div>
        )}
      </div>
      <p className=" p-4 text-gray-500">{filtered.length} cycle counts</p>
    </div>
    
  );
}
