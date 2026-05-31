"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  FaChild,
  FaFileAlt,
  FaBullhorn,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

interface PortalDashboard {
  user: User;
  children: Child[];
  pendingApplications: number;
  approvedApplications: number;
}

export default function ParentPortal() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<PortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/auth/login");
      return;
    }

    // Mock data - in production, fetch from API
    const userData = JSON.parse(user);
    setDashboard({
      user: userData,
      children: [
        {
          id: "1",
          firstName: "Emma",
          lastName: userData.lastName,
          dateOfBirth: "2021-03-15",
        },
      ],
      pendingApplications: 1,
      approvedApplications: 0,
    });
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const quickLinks = [
    {
      icon: FaFileAlt,
      label: "View Applications",
      href: "/portal/applications",
      count: dashboard.pendingApplications,
    },
    {
      icon: FaBullhorn,
      label: "Announcements",
      href: "/portal/announcements",
    },
    {
      icon: FaChild,
      label: "My Children",
      href: "#",
      count: dashboard.children.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">
            Welcome, {dashboard.user.firstName}!
          </h1>
          <p className="text-blue-100 mt-2">Your child's school journey starts here</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: FaChild,
              label: "Children",
              value: dashboard.children.length,
              color: "blue",
            },
            {
              icon: FaClock,
              label: "Pending Apps",
              value: dashboard.pendingApplications,
              color: "yellow",
            },
            {
              icon: FaCheckCircle,
              label: "Approved",
              value: dashboard.approvedApplications,
              color: "green",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <Icon className={`text-3xl text-${stat.color}-500 mb-4`} />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Children */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">My Children</h2>
              <div className="space-y-4">
                {dashboard.children.map((child) => (
                  <motion.div
                    key={child.id}
                    className="p-4 border-l-4 border-primary-500 bg-blue-50 dark:bg-blue-900/20 rounded"
                    whileHover={{ x: 5 }}
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {child.firstName} {child.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      DOB: {new Date(child.dateOfBirth).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Applications Status */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Application Status</h2>
              {dashboard.pendingApplications > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Application Under Review
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Your application for Emma is being reviewed by our team. You'll
                      receive an email once a decision is made.
                    </p>
                    <Button size="sm" className="mt-4">
                      View Details
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No applications</p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push(link.href)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Icon className="text-primary-600 dark:text-primary-400" />
                      <div className="text-left flex-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {link.label}
                        </p>
                      </div>
                      {link.count && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                          {link.count}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Card>

            {/* Contact Support */}
            <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
              <h3 className="font-bold mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Contact our support team for any questions
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Contact Us
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
