"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import {
  FaFileAlt,
  FaImage,
  FaBullhorn,
  FaUsers,
  FaCalendar,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import toast from "react-hot-toast";

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  totalParents: number;
  totalChildren: number;
  totalBranches: number;
  upcomingEvents: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        } else {
          toast.error("Failed to load dashboard");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      icon: FaFileAlt,
      label: "Applications",
      value: stats?.totalApplications || 0,
      color: "blue",
    },
    {
      icon: FaClock,
      label: "Pending",
      value: stats?.pendingApplications || 0,
      color: "yellow",
    },
    {
      icon: FaCheckCircle,
      label: "Approved",
      value: stats?.approvedApplications || 0,
      color: "green",
    },
    {
      icon: FaUsers,
      label: "Parents",
      value: stats?.totalParents || 0,
      color: "purple",
    },
  ];

  const menuItems = [
    {
      icon: FaFileAlt,
      label: "Applications",
      href: "/admin/applications",
      count: stats?.pendingApplications,
    },
    {
      icon: FaUsers,
      label: "Parents",
      href: "/admin/parents",
      count: stats?.totalParents,
    },
    {
      icon: FaImage,
      label: "Gallery",
      href: "/admin/gallery",
    },
    {
      icon: FaBullhorn,
      label: "Announcements",
      href: "/admin/announcements",
    },
    {
      icon: FaCalendar,
      label: "Events",
      href: "/admin/events",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-blue-100 mt-2">Welcome back! Here's your overview</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "from-blue-500 to-blue-600",
              yellow: "from-yellow-500 to-yellow-600",
              green: "from-green-500 to-green-600",
              purple: "from-purple-500 to-purple-600",
            };
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-white dark:from-gray-800 to-gray-50 dark:to-gray-700">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} text-white flex items-center justify-center mb-4`}>
                    <Icon className="text-xl" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(item.href)}
                      className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Icon className="text-3xl text-primary-600 dark:text-primary-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.label}
                      </span>
                      {item.count && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Upcoming Events Sidebar */}
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
            {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500"
                  >
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(event.startDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No upcoming events</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
