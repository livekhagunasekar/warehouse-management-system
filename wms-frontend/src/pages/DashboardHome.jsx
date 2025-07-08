import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardHome() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/dashboard/summary/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSummary(response.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">📦 Warehouse Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-600">📦 Total Products</h2>
          <p className="text-3xl font-bold">{summary.total_products}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-600">📥 Inbound Today</h2>
          <p className="text-3xl font-bold">{summary.inbound_today}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-600">📤 Outbound Today</h2>
          <p className="text-3xl font-bold">{summary.outbound_today}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-gray-600">📦 Total Quantity in Stock</h2>
        <p className="text-3xl font-bold">{summary.total_quantity}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-gray-600">🤝 Total Suppliers</h2>
        <p className="text-3xl font-bold">{summary.total_suppliers}</p>
      </div>
    </div>
  );
}
