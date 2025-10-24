import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import ExamsPage from "./pages/ExamsPage";
import DashboardPage from "./pages/DashboardPage";
import ExamDetailsPage from "./pages/ExamDetailsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
