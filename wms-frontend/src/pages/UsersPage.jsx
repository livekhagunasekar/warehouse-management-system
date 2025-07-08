import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error loading users:", err));
  }, [token]);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

    const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        setUsers((prev) => prev.filter((u) => u.id !== userId)); // update UI
    } catch (error) {
        console.error("Error deleting user:", error.response?.data || error);
    }
    };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">👥 Users</h1>
        <button
          onClick={() => navigate('/dashboard/users/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add User
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded p-2 w-64"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left">Username</th>
              <th className="px-5 py-3 text-left">Email address</th>
              <th className="px-5 py-3 text-left">First name</th>
              <th className="px-5 py-3 text-left">Last name</th>
              <th className="px-5 py-3 text-left">Role</th>
              <th className="px-5 py-3 text-left">Staff status</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 text-left">{u.username}</td>
                <td className="px-5 py-3 text-left">{u.email || "-"}</td>
                <td className="px-5 py-3 text-left">{u.first_name || "-"}</td>
                <td className="px-5 py-3 text-left">{u.last_name || "-"}</td>
                <td className="px-5 py-3 text-left">{u.role || "-"}</td>
                <td className="px-5 py-3 text-left">
                {u.is_staff ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">
                    ✓
                    </span>
                ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-sm">
                    ✕
                    </span>
                )}
                </td>
                <td className="px-5 py-3 text-left space-x-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/dashboard/users/edit/${u.id}`)}
                        title="Edit User"
                        className="bg-blue-500 hover:bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded"
                    >
                        🖉
                    </button>

                    <button
                        onClick={() => handleDelete(u.id)}
                        title="Delete User"
                        className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded"
                    >
                        🗑️
                    </button>
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <div className="p-4 text-sm text-gray-600">
          {filteredUsers.length} user{filteredUsers.length !== 1 && "s"}
        </div>
    </div>
  );
}
