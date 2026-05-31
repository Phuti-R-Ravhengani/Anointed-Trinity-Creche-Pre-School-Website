"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">⚠️</div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Something Went Wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We encountered an unexpected error. Please try again or contact support
          if the problem persists.
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Go Home
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg text-left">
            <p className="text-sm font-mono text-red-900 dark:text-red-200">
              {error.message}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
