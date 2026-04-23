import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./hooks/useAuth";
import { useAuth } from "./hooks/useAuth";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Overview from "./pages/Overview";
import AcademicRisk from "./pages/AcademicRisk";
import Placement from "./pages/Placement";
import Skills from "./pages/Skills";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Internship from "./pages/Internship";
import Assistant from "./pages/Assistant";
import Analytics from "./pages/Analytics";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Overview />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/academic"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AcademicRisk />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/placement"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Placement />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Skills />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ResumeAnalyzer />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/internship"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Internship />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assistant"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Assistant />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Analytics />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppRoutes />
    </AuthProvider>
  );
}