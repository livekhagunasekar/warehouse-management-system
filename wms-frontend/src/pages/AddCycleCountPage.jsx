import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddCycleCountPage() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    product: "",
    counted_quantity: "",
    system_quantity: "",
    discrepancy_reason: "",
    adjusted_by: ""
  });

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [productRes, userRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/products/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/users/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProducts(productRes.data);
        setUsers(userRes.data);
      } catch (error) {
        console.error("Error fetching dropdown data", error);
      }
    };

    fetchDropdowns();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProductSelect = (e) => {
    const selectedId = e.target.value;
    const selectedProduct = products.find((p) => p.id.toString() === selectedId);
    setFormData((prev) => ({
      ...prev,
      product: selectedId,
      system_quantity: selectedProduct?.quantity || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/cycle-counts/`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
      navigate("/dashboard/cycle-counts");
    } catch (err) {
      console.error("Error saving cycle count", err.response?.data || err);
    }
  };
  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Cycle Count</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-semibold mb-1">Product:</label>
          <select
            name="product"
            value={formData.product}
            onChange={handleProductSelect}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
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
            name="system_quantity"
            value={formData.system_quantity}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Discrepancy Reason:</label>
          <textarea
            name="discrepancy_reason"
            value={formData.discrepancy_reason}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded h-28"
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
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/cycle-counts")}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Discard
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
