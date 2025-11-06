// formatação de datas para diferentes usos
export function formatDateForInput(isoDate: string): string {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
}

// formatação de datas para exibição ao usuário
export function formatDateForDisplay(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR");
}

// formtatação de datas para envio à API
export function formatDateForAPI(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toISOString();
}
