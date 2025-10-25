import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { Exam, ExamResult, Patient } from "../types";

interface PDFReportData {
  exam: Exam;
  result?: ExamResult | null;
  patient: Patient;
}

export class PDFGenerator {
  static async generateExamReport(data: PDFReportData): Promise<void> {
    console.log("📄 DEBUG - Generating PDF report...");

    try {
      // Criar novo documento PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // Adicionar cabeçalho
      this.addHeader(pdf, pageWidth, margin);

      // Adicionar informações da clínica
      this.addClinicInfo(pdf, margin, 40);

      let currentY = 70;

      // Adicionar informações do paciente
      currentY = this.addPatientInfo(
        pdf,
        data.patient,
        margin,
        currentY,
        contentWidth
      );
      currentY += 10;

      // Adicionar informações do exame
      currentY = this.addExamInfo(
        pdf,
        data.exam,
        margin,
        currentY,
        contentWidth
      );
      currentY += 10;

      // Adicionar resultado da análise (se existir)
      if (data.result) {
        currentY = this.addResultInfo(
          pdf,
          data.result,
          margin,
          currentY,
          contentWidth
        );
        currentY += 10;
      }

      // Adicionar observações
      currentY = this.addObservations(
        pdf,
        data.exam,
        margin,
        currentY,
        contentWidth
      );

      // Adicionar rodapé
      this.addFooter(pdf, pageWidth, pageHeight, margin);

      // Salvar PDF
      const fileName = `relatorio_exame_${
        data.exam.id
      }_${data.patient.name.replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);

      console.log("✅ DEBUG - PDF generated successfully:", fileName);
    } catch (error) {
      console.error("❌ DEBUG - Error generating PDF:", error);
      throw new Error("Erro ao gerar PDF");
    }
  }

  /**
   * Adicionar cabeçalho do relatório
   */
  private static addHeader(
    pdf: jsPDF,
    pageWidth: number,
    margin: number
  ): void {
    // Logo e título
    pdf.setFillColor(59, 130, 246); // Azul
    pdf.rect(0, 0, pageWidth, 30, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("CLINICVISION", margin, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Relatório de Exame Médico", margin, 28);
  }

  /**
   * Adicionar informações da clínica
   */
  private static addClinicInfo(pdf: jsPDF, margin: number, y: number): void {
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const clinicInfo = [
      "ClinicVision - Diagnóstico por Imagem",
      "Rua das Clínicas, 123 - Centro, São Paulo - SP",
      "CEP: 01234-567 | Tel: (11) 3456-7890",
      "CRM: 123456 | CNPJ: 12.345.678/0001-90",
    ];

    clinicInfo.forEach((line, index) => {
      pdf.text(line, margin, y + index * 5);
    });
  }

  /**
   * Adicionar informações do paciente
   */
  private static addPatientInfo(
    pdf: jsPDF,
    patient: Patient,
    margin: number,
    y: number,
    width: number
  ): number {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(59, 130, 246);
    pdf.text("INFORMAÇÕES DO PACIENTE", margin, y);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);

    const patientData = [
      `Nome: ${patient.name}`,
      `Email: ${patient.email}`,
      `Telefone: ${patient.phone || "Não informado"}`,
      `Data de Nascimento: ${new Date(patient.birth_date).toLocaleDateString(
        "pt-BR"
      )}`,
      `Gênero: ${
        patient.gender === "male"
          ? "Masculino"
          : patient.gender === "female"
          ? "Feminino"
          : "Outro"
      }`,
      `Diabetes: ${patient.has_diabetes ? "Sim" : "Não"}`,
    ];

    let currentY = y + 8;
    patientData.forEach((line) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = 20;
      }
      pdf.text(line, margin, currentY);
      currentY += 5;
    });

    return currentY;
  }

  /**
   * Adicionar informações do exame
   */
  private static addExamInfo(
    pdf: jsPDF,
    exam: Exam,
    margin: number,
    y: number,
    width: number
  ): number {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(59, 130, 246);
    pdf.text("INFORMAÇÕES DO EXAME", margin, y);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);

    const examData = [
      `Tipo de Exame: ${exam.exam_type}`,
      `Data do Exame: ${new Date(exam.exam_date).toLocaleDateString("pt-BR")}`,
      `Status: ${
        exam.status === "completed"
          ? "Concluído"
          : exam.status === "pending"
          ? "Pendente"
          : "Cancelado"
      }`,
      `Data de Criação: ${new Date(exam.created_at!).toLocaleDateString(
        "pt-BR"
      )}`,
    ];

    let currentY = y + 8;
    examData.forEach((line) => {
      pdf.text(line, margin, currentY);
      currentY += 5;
    });

    // Descrição (se existir)
    if (exam.description) {
      currentY += 2;
      pdf.setFont("helvetica", "bold");
      pdf.text("Descrição:", margin, currentY);
      currentY += 4;
      pdf.setFont("helvetica", "normal");

      const descriptionLines = pdf.splitTextToSize(exam.description, width);
      descriptionLines.forEach((line: string) => {
        if (currentY > 270) {
          pdf.addPage();
          currentY = 20;
        }
        pdf.text(line, margin, currentY);
        currentY += 5;
      });
    }

    return currentY;
  }

  /**
   * Adicionar informações do resultado
   */
  private static addResultInfo(
    pdf: jsPDF,
    result: ExamResult,
    margin: number,
    y: number,
    width: number
  ): number {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(59, 130, 246);
    pdf.text("RESULTADO DA ANÁLISE", margin, y);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);

    let currentY = y + 8;

    // Diagnóstico
    const diagnosis =
      result.diagnosis === "No_DR"
        ? "SEM RETINOPATIA DIABÉTICA"
        : "COM RETINOPATIA DIABÉTICA";
    const diagnosisColor =
      result.diagnosis === "No_DR" ? [34, 197, 94] : [239, 68, 68]; // Verde ou Vermelho

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(diagnosisColor[0], diagnosisColor[1], diagnosisColor[2]);
    pdf.text(`DIAGNÓSTICO: ${diagnosis}`, margin, currentY);
    currentY += 6;

    // Probabilidades
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");
    pdf.text("PROBABILIDADES:", margin, currentY);
    currentY += 4;

    if (result.probability_no_dr) {
      pdf.text(
        `• Sem Retinopatia (No_DR): ${(result.probability_no_dr * 100).toFixed(
          1
        )}%`,
        margin + 5,
        currentY
      );
      currentY += 4;
    }

    if (result.probability_dr) {
      pdf.text(
        `• Com Retinopatia (DR): ${(result.probability_dr * 100).toFixed(1)}%`,
        margin + 5,
        currentY
      );
      currentY += 4;
    }

    // Recomendações (se existir)
    if (result.recommendation) {
      currentY += 2;
      pdf.setFont("helvetica", "bold");
      pdf.text("RECOMENDAÇÕES:", margin, currentY);
      currentY += 4;
      pdf.setFont("helvetica", "normal");

      const recommendationLines = pdf.splitTextToSize(
        result.recommendation,
        width
      );
      recommendationLines.forEach((line: string) => {
        if (currentY > 270) {
          pdf.addPage();
          currentY = 20;
        }
        pdf.text(line, margin, currentY);
        currentY += 4;
      });
    }

    // Informações técnicas
    currentY += 2;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Tipo de análise: ${
        result.is_auto_diagnosis ? "Automática (IA)" : "Manual"
      }`,
      margin,
      currentY
    );
    currentY += 3;

    if (result.analyzed_at) {
      pdf.text(
        `Data da análise: ${new Date(result.analyzed_at).toLocaleDateString(
          "pt-BR"
        )}`,
        margin,
        currentY
      );
      currentY += 3;
    }

    if (result.class_predicted) {
      pdf.text(`Classe predita: ${result.class_predicted}`, margin, currentY);
    }

    return currentY;
  }

  /**
   * Adicionar observações
   */
  private static addObservations(
    pdf: jsPDF,
    exam: Exam,
    margin: number,
    y: number,
    width: number
  ): number {
    if (!exam.notes) return y;

    let currentY = y;

    if (currentY > 250) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(59, 130, 246);
    pdf.text("OBSERVAÇÕES", margin, currentY);

    currentY += 6;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);

    const notesLines = pdf.splitTextToSize(exam.notes, width);
    notesLines.forEach((line: string) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = 20;
      }
      pdf.text(line, margin, currentY);
      currentY += 5;
    });

    return currentY;
  }

  /**
   * Adicionar rodapé
   */
  private static addFooter(
    pdf: jsPDF,
    pageWidth: number,
    pageHeight: number,
    margin: number
  ): void {
    const footerY = pageHeight - 15;

    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont("helvetica", "normal");

    const date = new Date().toLocaleDateString("pt-BR");
    const time = new Date().toLocaleTimeString("pt-BR");

    pdf.text(`Relatório gerado em: ${date} às ${time}`, margin, footerY);
    pdf.text(
      "ClinicVision - Sistema de Gestão Médica",
      pageWidth - margin,
      footerY,
      { align: "right" }
    );
  }

  /**
   * Gerar PDF a partir de elemento HTML (alternativa)
   */
  static async generatePDFFromElement(
    element: HTMLElement,
    filename: string
  ): Promise<void> {
    try {
      console.log("📄 DEBUG - Generating PDF from HTML element...");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calcular dimensões para caber na página
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgHeight / imgWidth;
      const pdfWidth = pageWidth - 20;
      const pdfHeight = pdfWidth * ratio;

      // Adicionar múltiplas páginas se necessário
      let heightLeft = pdfHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
      console.log("✅ DEBUG - PDF from HTML generated successfully");
    } catch (error) {
      console.error("❌ DEBUG - Error generating PDF from HTML:", error);
      throw new Error("Erro ao gerar PDF a partir do HTML");
    }
  }
}
