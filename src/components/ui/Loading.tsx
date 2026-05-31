"use client";

import React from "react";
import { motion } from "framer-motion";

export const Spinner: React.FC = () => (
  <motion.div
    className="w-12 h-12 border-4 border-primary-200 dark:border-primary-900 border-t-primary-500 rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

export const Skeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg ${className}`}
  />
);
