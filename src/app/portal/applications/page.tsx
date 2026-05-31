"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";

interface Application {
  id: string;
  referenceNumber: string;
  status: string;
  child: { firstName: string; lastName: string };
  branch: { name: string };
  createdAt: string;
  reviewedAt?: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Mock data - in production, fetch from API
    setApplications([
      {
        id: "1",
        referenceNumber: "ATK-2024-001",
        status: "REVIEWING",
        child: { firstName: "Emma", lastName: "Johnson" },
        branch: { name: "Johannesburg Main Campus" },
        createdAt: "2024-01-15",
        reviewedAt: "2024-01-20",
      },
    ]);
    setLoading(false);
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "info";
      case "REVIEWING":
        return "warning";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push("/portal/dashboard")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">My Applications</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
          </Card>
        ) : applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {app.child.firstName} {app.child.lastName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Reference: <span className="font-mono">{app.referenceNumber}</span>
                      </p>
                    </div>
                    <Badge variant={getStatusColor(app.status) as any}>
                      {app.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                        School
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {app.branch.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                        Submitted
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {app.reviewedAt && (
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                          Reviewed
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(app.reviewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button size="sm">View Full Application</Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FaDownload /> Download PDF
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No applications yet</p>
            <Button className="mt-4">
              Start New Application
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
