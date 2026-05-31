"use client";

import React from "react";
import { motion } from "framer-motion";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variants = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs font-medium rounded-full",
    md: "px-3 py-1.5 text-sm font-semibold rounded-full",
  };

  return (
    <motion.span
      className={`inline-block ${variants[variant]} ${sizes[size]} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {children}
    </motion.span>
  );
};
