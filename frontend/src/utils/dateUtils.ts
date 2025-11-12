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
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}
