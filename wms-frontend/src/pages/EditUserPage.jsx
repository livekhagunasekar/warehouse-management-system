import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/users/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setUserData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: name === "role" ? value.toLowerCase() : type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Submitting userData:", userData);

    axios
      .put(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/users/${id}/`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => navigate("/dashboard/users"))
      .catch((err) => {
        console.error("Error updating user:", err.response?.data || err.message);
        alert("Update failed:\n" + JSON.stringify(err.response?.data, null, 2));
      });
  };

  if (loading || !userData) return <p>Loading user data...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Change User</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Username:</label>
          <input type="text" name="username" value={userData.username || ""} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block font-semibold">Email Address:</label>
          <input type="email" name="email" value={userData.email || ""} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">First Name:</label>
            <input type="text" name="first_name" value={userData.first_name || ""} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold">Last Name:</label>
            <input type="text" name="last_name" value={userData.last_name || ""} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>

        <div>
          <label className="block font-semibold">Role:</label>
          <select
            name="role"
            value={userData.role?.toLowerCase() || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Role --</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="operator">Operator</option>
          </select>
        </div>

        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_active" checked={userData.is_active || false} onChange={handleChange} />
            Active
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_staff" checked={userData.is_staff || false} onChange={handleChange} />
            Staff Status
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_superuser" checked={userData.is_superuser || false} onChange={handleChange} />
            Superuser Status
          </label>
        </div>

        <div className="flex justify-between pt-6">
          <button type="button" onClick={() => navigate("/dashboard/users")} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">← Back</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
        </div>
      </form>
    </div>
  );
}
