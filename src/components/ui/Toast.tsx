"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";

interface ToastProps {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = "info",
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    info: <FaInfoCircle />,
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`${colors[type]} px-6 py-4 rounded-lg shadow-xl flex items-center justify-between gap-4 min-w-[300px]`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <p>{message}</p>
      </div>
      <button onClick={() => onClose(id)} className="hover:opacity-70">
        <FaTimes size={20} />
      </button>
    </motion.div>
  );
};
