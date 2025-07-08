import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddAuditLogPage() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    user: "",
    product: "",
    action: "create",
    description: ""
  });

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/products/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(userRes.data);
        setProducts(productRes.data);
      } catch (error) {
        console.error("Error loading dropdowns", error);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/inventory/audit-logs/`, 
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    navigate("/dashboard/auditlogs");
  } catch (error) {
    console.error("Error saving audit log", error.response?.data || error);
  }
};


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Inventory Audit Log</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">

        <div>
          <label className="block font-semibold mb-1">User:</label>
          <select
            name="user"
            value={formData.user}
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
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Action:</label>
          <select
            name="action"
            value={formData.action}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="archive">Archive</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded h-32"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/auditlogs")}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            ← Back
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
