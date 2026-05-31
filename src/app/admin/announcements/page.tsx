"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { FaArrowLeft, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  published: boolean;
  createdAt: string;
}

interface AnnouncementFormData {
  title: string;
  content: string;
  priority: string;
}

export default function AnnouncementsManagementPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<AnnouncementFormData>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Mock data
    setAnnouncements([
      {
        id: "1",
        title: "School Holiday",
        content:
          "The school will be closed from June 15 - July 5 for winter holidays.",
        priority: "NORMAL",
        published: true,
        createdAt: "2024-06-01",
      },
      {
        id: "2",
        title: "Updated Fees Structure",
        content: "Please review the attached document for new fees effective July 2024.",
        priority: "HIGH",
        published: true,
        createdAt: "2024-05-15",
      },
    ]);
    setLoading(false);
  }, [router]);

  const onSubmit = async (data: AnnouncementFormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, published: true }),
      });

      if (response.ok) {
        toast.success("Announcement published!");
        reset();
        setShowForm(false);
      } else {
        toast.error("Failed to publish announcement");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (announcementId: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Announcement deleted");
        setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
      } else {
        toast.error("Failed to delete announcement");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
      case "URGENT":
        return "error";
      case "NORMAL":
        return "info";
      case "LOW":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold">Announcements</h1>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <FaPlus /> New Announcement
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Publish Announcement</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Title"
                  placeholder="Important Announcement"
                  {...register("title", { required: "Title is required" })}
                  error={errors.title?.message}
                />

                <TextArea
                  label="Content"
                  placeholder="Write your announcement..."
                  rows={6}
                  {...register("content", { required: "Content is required" })}
                  error={errors.content?.message}
                />

                <Select
                  label="Priority"
                  options={[
                    { value: "LOW", label: "Low" },
                    { value: "NORMAL", label: "Normal" },
                    { value: "HIGH", label: "High" },
                    { value: "URGENT", label: "Urgent" },
                  ]}
                  {...register("priority", { required: "Priority is required" })}
                />

                <div className="flex gap-3">
                  <Button type="submit" isLoading={isSubmitting}>
                    Publish
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Announcements List */}
        {loading ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
          </Card>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                        {announcement.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant={getPriorityColor(announcement.priority) as any}>
                        {announcement.priority}
                      </Badge>
                      {announcement.published && (
                        <Badge variant="success">Published</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <FaEye /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No announcements published yet
            </p>
            <Button onClick={() => setShowForm(true)}>Publish First Announcement</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
