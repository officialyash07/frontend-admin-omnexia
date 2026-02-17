import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ResourcePage from "./pages/ResourcePage";
import Certificate from "./pages/Certificate";
import JobsManagement from "./pages/JobsManagement";
import AdminCertificateList from "./pages/AdminCertificateList";
import AdminCertificateUpload from "./pages/AdminCertificateUpload";
import Users from "./pages/Users";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Jobs Route */}
          <Route
            path="/models/jobs"
            element={
              <ProtectedRoute>
                <JobsManagement />
              </ProtectedRoute>
            }
          />

          {/* USER */}
          <Route path="/certificate" element={<Certificate />} />

          {/* ADMIN CERTIFICATE */}
          <Route
            path="/admin/certificate"
            element={
              <ProtectedRoute>
                <AdminCertificateList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certificate/upload"
            element={
              <ProtectedRoute>
                <AdminCertificateUpload />
              </ProtectedRoute>
            }
          />

          {/* MODEL ROUTE */}
          <Route
            path="/models/user"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/models/:model"
            element={
              <ProtectedRoute>
                <ResourcePage />
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
