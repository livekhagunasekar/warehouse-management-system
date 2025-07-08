import { Routes, Route, Navigate } from "react-router-dom"; 
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from './pages/ProductDetail';
import ProductEdit from './pages/ProductEdit';
import ProductAdd from './pages/ProductAdd';
import InboundsPage from "./pages/InboundsPage";
import InboundList from "./pages/InboundList";
import InboundEdit from './pages/InboundEdit';
import AddInboundPage from './pages/AddInboundPage';
import OutboundsPage from './pages/OutboundsPage';
import AddOutboundPage from './pages/AddOutboundPage';
import AuditLogsPage from "./pages/AuditLogsPage";
import AddAuditLogPage from "./pages/AddAuditLogPage";
import SuppliersPage from "./pages/SuppliersPage";
import EditSupplierPage from "./pages/EditSupplierPage";
import AddSupplierPage from "./pages/AddSupplierPage";
import CycleCountPage from "./pages/CycleCountPage";
import AddCycleCountPage from "./pages/AddCycleCountPage";
import EditCycleCountPage from "./pages/EditCycleCountPage";
import UsersPage from "./pages/UsersPage";
import EditUserPage from "./pages/EditUserPage";
import AddUserPage from "./pages/AddUserPage";
import AuditSummaryPage from "./pages/AuditSummaryPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="inbounds" element={<InboundsPage />} />
          <Route path="inbound" element={<InboundList />} />
          <Route path="inbounds/edit/:id" element={<InboundEdit />} />
          <Route path="inbounds/add" element={<AddInboundPage />} />
          <Route path="outbounds" element={<OutboundsPage />} />
          <Route path="outbounds/add" element={<AddOutboundPage />} />
          <Route path="auditlogs" element={<AuditLogsPage />} />
          <Route path="auditlogs/add" element={<AddAuditLogPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="suppliers/edit/:id" element={<EditSupplierPage />} />
          <Route path="suppliers/add" element={<AddSupplierPage />} />
          <Route path="cycle-counts" element={<CycleCountPage />} />
          <Route path="cycle-counts/add" element={<AddCycleCountPage />} />
          <Route path="cycle-counts/edit/:id" element={<EditCycleCountPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/edit/:id" element={<EditUserPage />} />
          <Route path="users/add" element={<AddUserPage />} />
          <Route path="audit-summary" element={<AuditSummaryPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored" />
    </>
  );
}