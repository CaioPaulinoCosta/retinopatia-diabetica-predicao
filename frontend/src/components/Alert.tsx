"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
  duration?: number;
}

export default function Alert({
  type,
  message,
  onClose,
  duration = 5000,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const alertConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50 border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-600",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-50 border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-amber-50 border-amber-200",
      textColor: "text-amber-800",
      iconColor: "text-amber-600",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
    },
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md animate-in slide-in-from-top-8 duration-300">
      <div
        className={`${config.bgColor} border rounded-2xl shadow-lg p-4 mx-4`}
      >
        <div className="flex items-start space-x-3">
          <Icon
            size={20}
            className={`${config.iconColor} mt-0.5 flex-shrink-0`}
          />
          <div className="flex-1">
            <p className={`text-sm font-medium ${config.textColor}`}>
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors ${config.textColor}`}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
