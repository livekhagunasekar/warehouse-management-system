import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Barcode from "react-barcode";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/products/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err);
      toast.error("Failed to delete product.");
    }
  };


  return (
    <div className="p-6">
      {/* Title & Controls */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Product Inventory</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          ⬅ Back
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Search:</label>
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full max-w-md"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => navigate('/dashboard/products/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Product
        </button>
      </div>


      {/* Product Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">SKU</th>
              <th className="text-left p-3">Quantity</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Barcode</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.sku}</td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">
                    <Barcode value={product.sku} height={40} />
                  </td>
                  <td className="px-5 py-3 text-left space-x-2">
                  <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}
                        title="Edit User"
                        className="bg-blue-500 hover:bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded"
                    >
                        🖉
                    </button>

                    <button
                        onClick={() => handleDelete(product.id)}
                        title="Delete User"
                        className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded"
                    >
                        🗑️
                    </button>
                  </div>
                </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="5">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
