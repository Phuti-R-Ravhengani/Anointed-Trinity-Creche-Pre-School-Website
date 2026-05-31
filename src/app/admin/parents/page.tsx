"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FaArrowLeft, FaUser } from "react-icons/fa";

interface Parent {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  numberOfChildren: number;
  createdAt: string;
}

export default function ParentsManagementPage() {
  const router = useRouter();
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Mock data
    setParents([
      {
        id: "1",
        user: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phoneNumber: "+27 123 456 789",
        },
        numberOfChildren: 2,
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        user: {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          phoneNumber: "+27 987 654 321",
        },
        numberOfChildren: 1,
        createdAt: "2024-01-10",
      },
    ]);
    setLoading(false);
  }, [router]);

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
          <h1 className="text-3xl font-bold">Parent Management</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
          </Card>
        ) : parents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parents.map((parent, index) => (
              <motion.div
                key={parent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                      <FaUser />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {parent.user.firstName} {parent.user.lastName}
                      </h3>
                      <Badge variant="info">{parent.numberOfChildren} children</Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      <a href={`mailto:${parent.user.email}`} className="text-primary-600 hover:underline">
                        {parent.user.email}
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      <a href={`tel:${parent.user.phoneNumber}`} className="text-primary-600 hover:underline">
                        {parent.user.phoneNumber}
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold">Registered:</span>{" "}
                      {new Date(parent.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold text-primary-600 dark:text-primary-400">
                    View Details
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No parents registered yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
