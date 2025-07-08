import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductAdd() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    tags: '',
    description: '',
    category: '',
    quantity: '',
    low_stock_threshold: '',
    is_archived: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('accessToken');
    
    // ✅ Log the endpoint URL before the request
    console.log(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/products/`);

    // ✅ Axios call with proper headers object
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/products/`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    navigate('/dashboard/products');
  } catch (err) {
    console.error('Failed to add product:', err);
  }
};


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Name', name: 'name' },
          { label: 'SKU', name: 'sku' },
          { label: 'Tags', name: 'tags' },
          { label: 'Description', name: 'description' },
          { label: 'Category', name: 'category' },
          { label: 'Quantity', name: 'quantity', type: 'number' },
          { label: 'Low Stock Threshold', name: 'low_stock_threshold', type: 'number' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label className="block font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        ))}

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_archived"
            checked={formData.is_archived}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Is Archived</label>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Product
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/products')}
            className="text-blue-600 underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
