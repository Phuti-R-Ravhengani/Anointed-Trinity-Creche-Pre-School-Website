"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = true,
  onClick,
}) => {
  return (
    <motion.div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-card overflow-hidden ${
        hover ? "hover:shadow-lg" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
      whileHover={hover ? { y: -4 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
