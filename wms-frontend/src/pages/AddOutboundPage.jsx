import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddOutboundPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    customer: "",
    so_reference: "",
    dispatched_date: "",
    file: null,
  });

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) {
      if (form[key]) data.append(key, form[key]);
    }

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/outbounds/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Outbound added successfully");
        navigate("/dashboard/outbounds");
      })
      .catch((err) => {
        console.error("Error creating outbound:", err.response?.data || err);
        alert("Failed to create outbound");
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">➕ Add Outbound Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">Product</label>
          <select
            name="product"
            value={form.product}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            min={1}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Customer</label>
          <input
            type="text"
            name="customer"
            value={form.customer}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">SO Reference</label>
          <input
            type="text"
            name="so_reference"
            value={form.so_reference}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Dispatched Date</label>
          <input
            type="date"
            name="dispatched_date"
            value={form.dispatched_date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Attach File (optional)</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png,.doc,.docx"
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/outbounds")}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
          >
            Save Outbound
          </button>
        </div>
      </form>
    </div>
  );
}
