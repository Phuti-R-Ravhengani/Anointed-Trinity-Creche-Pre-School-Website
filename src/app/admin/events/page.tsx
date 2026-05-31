"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  capacity: number;
}

export default function EventsManagementPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<EventFormData>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Mock data
    setEvents([
      {
        id: "1",
        title: "Annual Sports Day",
        startDate: "2024-06-15",
        capacity: 100,
        rsvpCount: 25,
      },
    ]);
    setLoading(false);
  }, [router]);

  const onSubmit = async (data: EventFormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Event created successfully!");
        reset();
        setShowForm(false);
        // Refresh events list
      } else {
        toast.error("Failed to create event");
      }
    } catch (error) {
      toast.error("An error occurred");
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
            <h1 className="text-3xl font-bold">Manage Events</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Event"}
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
              <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Event Title"
                  placeholder="Annual Sports Day"
                  {...register("title", { required: "Title is required" })}
                  error={errors.title?.message}
                />

                <TextArea
                  label="Description"
                  placeholder="Event description..."
                  rows={4}
                  {...register("description", { required: "Description is required" })}
                  error={errors.description?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="datetime-local"
                    {...register("startDate", { required: "Start date is required" })}
                    error={errors.startDate?.message}
                  />
                  <Input
                    label="End Date"
                    type="datetime-local"
                    {...register("endDate", { required: "End date is required" })}
                    error={errors.endDate?.message}
                  />
                </div>

                <Input
                  label="Location"
                  placeholder="Main Auditorium"
                  {...register("location")}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    options={[
                      { value: "SPORTS_DAY", label: "Sports Day" },
                      { value: "CULTURAL_PROGRAM", label: "Cultural Program" },
                      { value: "PARENT_MEETING", label: "Parent Meeting" },
                      { value: "CELEBRATION", label: "Celebration" },
                    ]}
                    {...register("category", { required: "Category is required" })}
                  />
                  <Input
                    label="Capacity"
                    type="number"
                    {...register("capacity", {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <Button type="submit" isLoading={isSubmitting}>
                  Create Event
                </Button>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Events List */}
        {loading ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
          </Card>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 rounded-full text-sm">
                      {event.rsvpCount} / {event.capacity} RSVPs
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No events yet</p>
            <Button onClick={() => setShowForm(true)}>Create Your First Event</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
