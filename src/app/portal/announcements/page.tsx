"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { FaArrowLeft } from "react-icons/fa";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Mock data
    setAnnouncements([
      {
        id: "1",
        title: "School Holiday",
        content: "The school will be closed from June 15 - July 5 for winter holidays. Have a wonderful break!",
        priority: "NORMAL",
        createdAt: "2024-06-01",
      },
      {
        id: "2",
        title: "Important: Updated Fees Structure",
        content: "Please review the attached document for the new fees structure effective from July 2024.",
        priority: "HIGH",
        createdAt: "2024-05-15",
      },
    ]);
    setLoading(false);
  }, [router]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
      case "URGENT":
        return "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200";
      case "NORMAL":
        return "bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-200";
      case "LOW":
        return "bg-gray-100 dark:bg-gray-700 border-gray-500 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 border-gray-500";
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
          <h1 className="text-3xl font-bold">School Announcements</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
          </Card>
        ) : announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 border-l-4 ${getPriorityColor(announcement.priority)}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {announcement.title}
                    </h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      announcement.priority === "HIGH" || announcement.priority === "URGENT"
                        ? "bg-red-200 text-red-900 dark:bg-red-900/40 dark:text-red-300"
                        : "bg-blue-200 text-blue-900 dark:bg-blue-900/40 dark:text-blue-300"
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(announcement.createdAt).toLocaleDateString("en-ZA", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No announcements at the moment
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
