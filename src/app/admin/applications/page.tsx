"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";

interface Application {
  id: string;
  referenceNumber: string;
  status: string;
  parent: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  child: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchApplications = async () => {
      try {
        const url = new URL("/api/applications", window.location.origin);
        if (statusFilter !== "all") {
          url.searchParams.append("status", statusFilter);
        }

        const response = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setApplications(data.applications || []);
        } else {
          toast.error("Failed to load applications");
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [router, statusFilter]);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Application ${newStatus.toLowerCase()}`);
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      } else {
        toast.error("Failed to update application");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

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
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Manage Applications</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and process admission applications
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="mb-6">
          <Select
            options={[
              { value: "all", label: "All Applications" },
              { value: "PENDING", label: "Pending" },
              { value: "REVIEWING", label: "Reviewing" },
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-64"
          />
        </div>

        {/* Table */}
        {loading ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
          </Card>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <Card>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Ref Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Child Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Parent Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Date Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <motion.tr
                      key={app.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4 text-sm font-mono text-primary-600 dark:text-primary-400">
                        {app.referenceNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {app.child.firstName} {app.child.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {app.parent.user.firstName} {app.parent.user.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge variant={getStatusColor(app.status) as any}>
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Select
                          options={[
                            { value: "PENDING", label: "Pending" },
                            { value: "REVIEWING", label: "Reviewing" },
                            { value: "APPROVED", label: "Approve" },
                            { value: "REJECTED", label: "Reject" },
                          ]}
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value)
                          }
                          className="w-40"
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No applications found
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
