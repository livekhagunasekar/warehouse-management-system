import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCycleCountPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    product: "",
    counted_quantity: "",
    system_quantity: "",
    discrepancy_reason: "",
    adjusted_by: "",
  });

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      // const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const [cycleRes, productRes, userRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/cycle-counts/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/products/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setFormData({
        product: cycleRes.data.product,
        counted_quantity: cycleRes.data.counted_quantity,
        system_quantity: cycleRes.data.system_quantity,
        discrepancy_reason: cycleRes.data.discrepancy_reason || "",
        adjusted_by: cycleRes.data.adjusted_by,
      });

      setProducts(productRes.data);
      setUsers(userRes.data);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  fetchData();
}, [id, token]);


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/cycle-counts/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard/cycle-counts");
    } catch (error) {
      console.error("Error updating cycle count", error.response?.data || error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Cycle Count</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-semibold mb-1">Product:</label>
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Counted Quantity:</label>
          <input
            type="number"
            name="counted_quantity"
            value={formData.counted_quantity}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">System Quantity:</label>
          <input
            type="number"
            value={formData.system_quantity}
            readOnly
            className="w-full border p-2 bg-gray-100 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Discrepancy Reason:</label>
          <textarea
            name="discrepancy_reason"
            value={formData.discrepancy_reason}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Adjusted By:</label>
          <select
            name="adjusted_by"
            value={formData.adjusted_by}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select User --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/cycle-counts")}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
