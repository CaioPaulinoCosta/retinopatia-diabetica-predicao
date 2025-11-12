import { useState } from "react";

interface AlertState {
  type: "success" | "error" | "warning" | "info";
  message: string;
  visible: boolean;
}

export function useAlert() {
  const [alert, setAlert] = useState<AlertState>({
    type: "success",
    message: "",
    visible: false,
  });

  const showAlert = (type: AlertState["type"], message: string) => {
    setAlert({ type, message, visible: true });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return {
    alert,
    showAlert,
    hideAlert,
  };
}
