"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ExamFormEdit from "@/components/Exams/ExamFormEdit";
import PrivateRoute from "@/components/Auth/PrivateRoutes";

export default function NewExamPage() {
  return (
    <PrivateRoute>
      <>
        <Header />
        <ExamFormEdit />
        <Footer />
      </>
    </PrivateRoute>
  );
}
