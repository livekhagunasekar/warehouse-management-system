import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/dashboard/recent-activity/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLogs(res.data.recent_activity);
        setFilteredLogs(res.data.recent_activity);
      })
      .catch((err) => console.error("Failed to fetch logs:", err));
  }, [token]);

  useEffect(() => {
    const filtered = logs.filter((log) =>
      log.product.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [searchTerm, logs]);

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">📚 Inventory Audit Logs</h1>
        <button
          onClick={() => navigate('/dashboard/auditlogs/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Audit Log
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full md:w-1/3"
      />

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left">Timestamp</th>
              <th className="px-5 py-3 text-left">User</th>
              <th className="px-5 py-3 text-left">Action</th>
              <th className="px-5 py-3 text-left">Product</th>
              <th className="px-5 py-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentLogs.map((log, index) => (
              <tr key={index}>
                <td className="px-5 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-5 py-3">{log.user}</td>
                <td className="px-5 py-3 capitalize">{log.action}</td>
                <td className="px-5 py-3">{log.product}</td>
                <td className="px-5 py-3">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="p-4 text-center text-gray-500">No logs found.</div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">Total Logs: {filteredLogs.length}</p>
        {totalPages > 1 && (
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
