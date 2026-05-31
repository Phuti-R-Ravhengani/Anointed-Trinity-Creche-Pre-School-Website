"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FaArrowLeft, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface GalleryImage {
  id: string;
  title: string;
  image: string;
  category: string;
  createdAt: string;
}

interface UploadFormData {
  title: string;
  image: string;
  category: string;
}

export default function GalleryManagementPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<UploadFormData>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Mock data
    setImages([
      {
        id: "1",
        title: "Learning Activities",
        image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&h=400",
        category: "LEARNING_ACTIVITIES",
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        title: "Sports Day",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400",
        category: "SPORTS",
        createdAt: "2024-01-10",
      },
    ]);
    setLoading(false);
  }, [router]);

  const onSubmit = async (data: UploadFormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Image uploaded successfully!");
        reset();
        setShowForm(false);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Image deleted");
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      } else {
        toast.error("Failed to delete image");
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
            <h1 className="text-3xl font-bold">Gallery Management</h1>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <FaPlus /> Add Image
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Upload New Image</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Image Title"
                  placeholder="Learning Activities"
                  {...register("title", { required: "Title is required" })}
                  error={errors.title?.message}
                />

                <Input
                  label="Image URL"
                  placeholder="https://..."
                  {...register("image", {
                    required: "Image URL is required",
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Please enter a valid URL",
                    },
                  })}
                  error={errors.image?.message}
                />

                <Select
                  label="Category"
                  options={[
                    { value: "CLASSES", label: "Classes" },
                    { value: "EVENTS", label: "Events" },
                    { value: "SPORTS", label: "Sports" },
                    { value: "LEARNING_ACTIVITIES", label: "Learning Activities" },
                  ]}
                  {...register("category", { required: "Category is required" })}
                />

                <div className="flex gap-3">
                  <Button type="submit" isLoading={isSubmitting}>
                    Upload Image
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

        {/* Images Grid */}
        {loading ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
          </Card>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-white hover:bg-white/20"
                        onClick={() => handleDelete(image.id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {image.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {image.category.replace("_", " ")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No images uploaded yet
            </p>
            <Button onClick={() => setShowForm(true)}>Upload First Image</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
