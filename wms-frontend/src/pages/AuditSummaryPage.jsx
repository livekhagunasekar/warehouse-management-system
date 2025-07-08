import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AuditSummaryPage() {
  const [summary, setSummary] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/dashboard/audit-summary/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to load audit summary", err);
      }
    };
    fetchSummary();
  }, [token]);

  if (!summary) return <div className="p-6">Loading summary...</div>;

  const barData = {
    labels: summary.product_updates.map(p => p.product__name),
    datasets: [
      {
        label: "Update Count",
        data: summary.product_updates.map(p => p.count),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const pieData = {
    labels: summary.action_counts.map(a => a.action),
    datasets: [
      {
        label: "Actions",
        data: summary.action_counts.map(a => a.count),
        backgroundColor: ["#ffd133", "#3b82f6", "#f43f5e", "#10b981"],
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">📊 Audit Summary</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Most Edited Product</p>
          <p className="text-lg font-semibold">{summary.product_updates[0]?.product__name || "N/A"}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Most Active User</p>
          <p className="text-lg font-semibold">{summary.user_activity[0]?.user__username || "N/A"}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Total Audit Logs</p>
          <p className="text-lg font-semibold">{summary.total_logs}</p>
        </div>
      </div>

      {/* Charts */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow h-124">
            <h2 className="text-lg font-semibold mb-2">Most Edited Products</h2>
            <div className="h-99">
            <Bar
                data={barData}
                options={{
                responsive: true,
                maintainAspectRatio: false,
                }}
            />
            </div>
        </div>

        <div className="bg-white p-4 rounded shadow h-124">
            <h2 className="text-lg font-semibold mb-2">Action Distribution</h2>
            <div className="h-99">
            <Pie
                data={pieData}
                options={{
                responsive: true,
                maintainAspectRatio: false,
                }}
            />
            </div>
        </div>
    </div>
    </div>
  );
}
