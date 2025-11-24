import React from "react";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

// 🌟 Style umum biar tampil rapi dan konsisten
const baseStyle = {
  className:
    "flex items-center gap-2 p-2.5 font-medium text-sm rounded-lg shadow-lg bg-white/95 backdrop-blur-md border border-gray-100",
  progressClassName: "bg-gradient-to-r from-blue-400 to-sky-500",
  icon: false,
};

// 🔧 Helper function
const makeToast = (Icon, color, message, type) => {
  const element = React.createElement(
    "div",
    { className: "flex items-center gap-2" },
    React.createElement(Icon, {
      size: 20,
      className: `${color} drop-shadow-sm flex-shrink-0`,
    }),
    React.createElement("span", { className: "text-gray-700" }, message)
  );

  return toast[element ? type : "info"](element, {
    ...baseStyle,
    autoClose: 2800,
    pauseOnHover: true,
    theme: "light",
    hideProgressBar: false,
    closeButton: false,
  });
};

// 🟢 Sukses
export const showSuccess = (message) =>
  makeToast(CheckCircle, "text-green-500", message, "success");

// 🔴 Error
export const showError = (message) =>
  makeToast(XCircle, "text-red-500", message, "error");

// 🟠 Peringatan
export const showWarning = (message) =>
  makeToast(AlertTriangle, "text-yellow-500", message, "warning");

// 🔵 Info
export const showInfo = (message) =>
  makeToast(Info, "text-blue-500", message, "info");

export const toastConfirm = (message, onConfirm) => {
  toast.info(
    React.createElement(
      "div",
      { className: "flex items-center gap-3" },
      React.createElement("span", null, message),
      React.createElement(
        "button",
        {
          onClick: () => {
            toast.dismiss();
            onConfirm();
          },
          className:
            "px-2 py-1 bg-emerald-600 text-white rounded-md text-xs font-medium hover:bg-emerald-700 transition",
        },
        "Ya"
      )
    ),
    {
      autoClose: false,
      closeOnClick: false,
      position: "top-right",
      theme: "light",
      hideProgressBar: false,
      className:
        "shadow-lg bg-white/95 backdrop-blur-lg border border-gray-100 rounded-xl",
      progressClassName: "bg-gradient-to-r from-blue-400 to-sky-500",
    }
  );
};