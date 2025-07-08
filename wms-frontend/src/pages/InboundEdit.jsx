import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function InboundEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inbound, setInbound] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
  const fetchData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      const [inboundRes, supplierRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/inbounds/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/suppliers/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setInbound(inboundRes.data);
      setSuppliers(supplierRes.data);
    } catch (error) {
      console.error("Error fetching inbound or suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id, token]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue =
      name === "quantity" ? parseInt(value) :
      name === "supplier" ? parseInt(value) :
      value;

    setInbound({ ...inbound, [name]: updatedValue });
  };


const handleSave = async () => {
  try {
    const formData = new FormData();
    formData.append("product", inbound.product);
    formData.append("supplier", inbound.supplier);
    formData.append("quantity", inbound.quantity);
    formData.append("reference", inbound.reference);
    formData.append("received_date", inbound.received_date);
    // If your model supports file update, append file here too

    console.log("FormData being sent");

    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/inventory/inbounds/${id}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // ✅ Important
        },
      }
    );

    alert("Inbound updated successfully!");
    navigate("/dashboard/inbounds");
  } catch (error) {
    console.error("Failed to save inbound:", error.response?.data || error);
    alert("Error saving changes.");
  }
};


  if (loading || !inbound) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Inbound</h2>

      <div className="mb-4">
        <label className="block font-semibold">Product</label>
        <input
          type="text"
          value={inbound.product_name}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={inbound.quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Supplier</label>
        <select
          name="supplier"
          value={inbound.supplier}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Reference</label>
        <input
          type="text"
          name="reference"
          value={inbound.reference || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Received Date</label>
        <input
          type="date"
          name="received_date"
          value={inbound.received_date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex gap-4 justify-end">
        <button
          onClick={() => navigate("/dashboard/inbounds")}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
    
  );
}
