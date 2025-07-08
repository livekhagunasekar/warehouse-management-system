import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSupplierPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    name: "",
    // email: "",
    // address: "",
    contact_info: ""
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/suppliers/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFormData({
          name: res.data.name || "",
          contact_info: res.data.contact_info || "",
        });
      })
      .catch((err) => {
        console.error("Error loading supplier:", err.response?.data || err);
      });
  }, [id, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/suppliers/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard/suppliers");
    } catch (err) {
      console.error("Error updating supplier:", err.response?.data || err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Supplier</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">

        <div>
          <label className="block font-semibold mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Contact Information:</label>
          <input
            type="text"
            name="contact_info"
            value={formData.contact_info}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/suppliers")}
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
