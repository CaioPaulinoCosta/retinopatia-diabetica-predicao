"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ExamForm from "@/components/Exams/ExamForm";
import PrivateRoute from "@/components/Auth/PrivateRoutes";

export default function NewExamPage() {
  return (
    <PrivateRoute>
      <>
        <Header />
        <ExamForm />
        <Footer />
      </>
    </PrivateRoute>
  );
}
