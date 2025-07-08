import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddUserPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    is_staff: false, 
    role: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/users/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard/users");
    } catch (err) {
      setError("Failed to create user");
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add User</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">

        <div>
          <label className="block font-semibold mb-1">Username:</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Enter email"
          />
        </div>
        <div>
            <label className="block font-semibold mb-1">Role:</label>
            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
            >
                <option value="">-- Select Role --</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="operator">Operator</option>
            </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Enter password"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Password confirmation:</label>
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Confirm password"
          />
        </div>

        <div className="flex items-center justify-between">
            <label htmlFor="is_staff" className="block font-semibold text-gray-700 mr-4">
                Staff Status:
            </label>
            <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    id="is_staff"
                    name="is_staff"
                    className="sr-only peer"
                    checked={formData.is_staff}
                    onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_staff: e.target.checked }))
                    }
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-focus:outline-none transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 pointer-events-none"></div>
                </label>
                <span className="text-sm text-gray-600">
                {formData.is_staff ? "Enabled" : "Disabled"}
                </span>
            </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/users")}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Discard
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
