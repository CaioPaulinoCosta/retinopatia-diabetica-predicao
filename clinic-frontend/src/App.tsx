// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import queryClient from "./queryClient";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import ExamsPage from "./pages/ExamsPage";
import ExamDetailsPage from "./pages/ExamDetailsPage";
import LoginPage from "./pages/Login";
import type { ReactNode } from "react";

// 🔐 Componente para proteger rotas com tipagem
interface ProtectedRouteProps {
  children: ReactNode;
  role?: "admin" | "user";
}

function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontSize: "14px" },
          success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
        }}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="patients"
            element={
              <ProtectedRoute role="admin">
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="exams"
            element={
              <ProtectedRoute role="admin">
                <ExamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="exams/:id"
            element={
              <ProtectedRoute role="admin">
                <ExamDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
