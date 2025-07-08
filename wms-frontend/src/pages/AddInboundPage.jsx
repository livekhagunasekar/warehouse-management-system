import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BarcodeScanner from "../components/BarcodeScanner";

export default function AddInboundPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    product: "",
    supplier: "",
    quantity: "",
    reference: "",
    received_date: new Date().toISOString().split("T")[0],
    created_by: "",
  });
  const [file, setFile] = useState(null);
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Token from localStorage:", token);

      // const baseURL = import.meta.env.VITE_API_BASE_URL;

      const [productsRes, suppliersRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/products/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/suppliers/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/users/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setProducts(productsRes.data);
      setSuppliers(suppliersRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Failed to load dropdown data:", error);
    }
  };

  fetchData();
}, []);


    // Auto-select product by scanned barcode
  useEffect(() => {
  if (barcode.trim() !== "") {
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/barcode/${barcode}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const product = res.data;
        if (product?.id) {
          setFormData((prev) => ({
            ...prev,
            product: product.id,
          }));
        }
      })
      .catch((err) => {
        // console.error("Product not found for scanned barcode:", err.response?.data || err);
        // alert("Product not found for barcode.");
      });
  }
}, [barcode, token]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault(); 

  const payload = new FormData();
  payload.append("product", formData.product);
  payload.append("supplier", formData.supplier);
  payload.append("quantity", formData.quantity);
  payload.append("reference", formData.reference);
  payload.append("received_date", formData.received_date);

  if (file) {
    payload.append("file", file);
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/inventory/inbounds/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Inbound added successfully!");
    navigate("/dashboard/inbounds");
  } catch (error) {
    console.error("Error adding inbound:", error.response?.data || error);
    alert("Failed to add inbound.");
  }
};


  <BarcodeScanner
  onDetected={async (scannedBarcode) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/inventory/products/barcode/${scannedBarcode}/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const product = res.data;
    setFormData((prev) => ({
      ...prev,
      product: product.id,
    }));
  } catch (err) {
    console.error("Product not found:", err.response?.data || err);
    alert("Product not found");
  }
}}

/>

return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Inbound</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">

        {/* Barcode input */}
        <div>
          <label className="block font-semibold mb-1">Scan/Enter Barcode:</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Scan barcode or enter SKU"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Product select */}
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

        {/* Quantity, Reference, Date */}
        <div>
          <label className="block font-semibold mb-1">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
                <div>
          <label className="block font-semibold mb-1">Supplier:</label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Reference:</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Received Date:</label>
          <input
            type="date"
            name="received_date"
            value={formData.received_date}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Submit buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/inbounds")}
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
