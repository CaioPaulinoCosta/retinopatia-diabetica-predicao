import React from "react";
import type { Exam, ExamResult, Patient } from "../../types";

interface ExamReportProps {
  exam: Exam;
  result?: ExamResult | null;
  patient: Patient;
}

export const ExamReport: React.FC<ExamReportProps> = ({
  exam,
  result,
  patient,
}) => {
  const getDiagnosisText = (diagnosis: string) => {
    return diagnosis === "No_DR"
      ? "SEM RETINOPATIA DIABÉTICA"
      : "COM RETINOPATIA DIABÉTICA";
  };

  const getDiagnosisColor = (diagnosis: string) => {
    return diagnosis === "No_DR" ? "text-green-600" : "text-red-600";
  };

  return (
    <div id="exam-report" className="bg-white p-8 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">CLINICVISION</h1>
        <p className="text-lg">Relatório de Exame Médico</p>
      </div>

      {/* Informações da Clínica */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          ClinicVision - Diagnóstico por Imagem
        </h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Rua das Clínicas, 123 - Centro, São Paulo - SP</p>
          <p>CEP: 01234-567 | Tel: (11) 3456-7890</p>
          <p>CRM: 123456 | CNPJ: 12.345.678/0001-90</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações do Paciente */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">
            INFORMAÇÕES DO PACIENTE
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Nome:</strong> {patient.name}
            </p>
            <p>
              <strong>Email:</strong> {patient.email}
            </p>
            <p>
              <strong>Telefone:</strong> {patient.phone || "Não informado"}
            </p>
            <p>
              <strong>Data Nasc.:</strong>{" "}
              {new Date(patient.birth_date).toLocaleDateString("pt-BR")}
            </p>
            <p>
              <strong>Gênero:</strong>{" "}
              {patient.gender === "male" ? "Masculino" : "Feminino"}
            </p>
            <p>
              <strong>Diabetes:</strong> {patient.has_diabetes ? "Sim" : "Não"}
            </p>
          </div>
        </div>

        {/* Informações do Exame */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">
            INFORMAÇÕES DO EXAME
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Tipo:</strong> {exam.exam_type}
            </p>
            <p>
              <strong>Data:</strong>{" "}
              {new Date(exam.exam_date).toLocaleDateString("pt-BR")}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                className={`ml-1 ${
                  exam.status === "completed"
                    ? "text-green-600"
                    : exam.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {exam.status === "completed" ? "Concluído" : "Pendente"}
              </span>
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(exam.created_at!).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </div>

      {/* Resultado da Análise */}
      {result && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">
            RESULTADO DA ANÁLISE
          </h3>

          <div className="text-center p-6 border rounded-lg bg-gray-50">
            <div
              className={`text-2xl font-bold ${getDiagnosisColor(
                result.diagnosis
              )} mb-2`}
            >
              {getDiagnosisText(result.diagnosis)}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-4">
              {result.probability_no_dr && (
                <div className="text-center">
                  <div className="text-green-600 font-bold text-lg">
                    {(result.probability_no_dr * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Sem Retinopatia</div>
                </div>
              )}

              {result.probability_dr && (
                <div className="text-center">
                  <div className="text-red-600 font-bold text-lg">
                    {(result.probability_dr * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Com Retinopatia</div>
                </div>
              )}
            </div>
          </div>

          {result.recommendation && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                RECOMENDAÇÕES:
              </h4>
              <p className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">
                {result.recommendation}
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-4 border-t pt-2">
            <p>
              Tipo de análise:{" "}
              {result.is_auto_diagnosis ? "Automática (IA)" : "Manual"}
            </p>
            <p>
              Data da análise:{" "}
              {result.analyzed_at
                ? new Date(result.analyzed_at).toLocaleDateString("pt-BR")
                : "N/A"}
            </p>
            {result.class_predicted && (
              <p>Classe predita: {result.class_predicted}</p>
            )}
          </div>
        </div>
      )}

      {/* Observações */}
      {exam.notes && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">
            OBSERVAÇÕES
          </h3>
          <p className="text-sm text-gray-700 mt-2">{exam.notes}</p>
        </div>
      )}

      {/* Rodapé */}
      <div className="mt-12 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <p>
          Relatório gerado em: {new Date().toLocaleDateString("pt-BR")} às{" "}
          {new Date().toLocaleTimeString("pt-BR")}
        </p>
        <p>ClinicVision - Sistema de Gestão Médica</p>
      </div>
    </div>
  );
};
