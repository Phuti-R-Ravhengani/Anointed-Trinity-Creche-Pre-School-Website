"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  id,
  dark = false,
}) => {
  return (
    <section
      id={id}
      className={`py-20 px-4 sm:px-6 lg:px-8 ${
        dark ? "bg-gray-900 dark:bg-black text-white" : "bg-white dark:bg-gray-900"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
};

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  centered = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>}
    </motion.div>
  );
};
