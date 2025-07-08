import { Outlet, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">ARTISELITE WMS</h2>
        <nav className="space-y-6">
          <button onClick={() => navigate('/dashboard')} className="block w-full text-left">
            📊 Dashboard
          </button>
          <button onClick={() => navigate('/dashboard/products')} className="block w-full text-left">
            📦 Products
          </button>
          <button onClick={() => navigate('/dashboard/inbounds')} className="block w-full text-left">
            📥 Inbounds
          </button>
          <button onClick={() => navigate('/dashboard/outbounds')} className="block w-full text-left">
            📤 Outbounds
          </button>
          <button
            onClick={() => navigate('/dashboard/auditlogs')}
            className="block w-full text-left"
          >
            📚 Audit Logs
          </button>
          <button onClick={() => navigate('/dashboard/suppliers')} className="block w-full text-left">
            🧾 Suppliers
          </button>
          <button onClick={() => navigate('/dashboard/cycle-counts')} className="block w-full text-left">
            🔁 Cycle Counts
          </button>
          <button
            onClick={() => navigate('/dashboard/audit-summary')}
            className="block w-full text-left"
          >
            📈 Audit Summary
          </button>
          <button onClick={() => navigate('/dashboard/users')} className="block w-full text-left">
            👥 Users
          </button>

        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">WELCOME TO ARTISELITE WMS SYSTEM!</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
