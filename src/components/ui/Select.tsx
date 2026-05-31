"use client";

import React from "react";
import { motion } from "framer-motion";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helperText, className = "", options = [], ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:opacity-50 cursor-pointer appearance-none ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
          } ${className}`}
          {...props}
        >
          {props.placeholder && (
            <option value="">{props.placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-gray-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
