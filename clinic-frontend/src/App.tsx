import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import ExamsPage from "./pages/ExamsPage";
import DashboardPage from "./pages/DashboardPage";
import ExamDetailsPage from "./pages/ExamDetailsPage";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // evita loop infinito de requisições com erro
      refetchOnWindowFocus: false, // não refaz fetch ao trocar de aba
      staleTime: 1000 * 60, // 1 min de cache
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Toaster global — aparece em todas as páginas */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontSize: "14px" },
          success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
        }}
      />

      {/* Rotas principais */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="exams/:id" element={<ExamDetailsPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
