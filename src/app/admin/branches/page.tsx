"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { FaArrowLeft, FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  managerName?: string;
  openingHours?: string;
  numberOfClasses: number;
  images: string[];
  description?: string;
}

interface BranchFormData {
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  managerName?: string;
  openingHours?: string;
  numberOfClasses?: number;
  description?: string;
  images?: string;
}

const defaultFormValues: BranchFormData = {
  name: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  phoneNumber: "",
  email: "",
  managerName: "",
  openingHours: "",
  numberOfClasses: 0,
  description: "",
  images: "",
};

export default function BranchesManagementPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormData>({ defaultValues: defaultFormValues });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadBranches = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/branches");
      const data = await response.json();
      setBranches(data.branches || []);
    } catch (error) {
      console.error("Failed to load branches:", error);
      toast.error("Unable to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
      return;
    }

    loadBranches();
  }, [router, token]);

  const openForm = (branch?: Branch) => {
    setShowForm(true);
    if (branch) {
      setEditingBranch(branch);
      setValue("name", branch.name);
      setValue("address", branch.address);
      setValue("city", branch.city);
      setValue("province", branch.province);
      setValue("postalCode", branch.postalCode);
      setValue("phoneNumber", branch.phoneNumber);
      setValue("email", branch.email);
      setValue("managerName", branch.managerName || "");
      setValue("openingHours", branch.openingHours || "");
      setValue("numberOfClasses", branch.numberOfClasses);
      setValue("description", branch.description || "");
      setValue("images", branch.images?.join(", ") || "");
    } else {
      setEditingBranch(null);
      reset(defaultFormValues);
    }
  };

  const onSubmit = async (data: BranchFormData) => {
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const payload = {
      ...data,
      numberOfClasses: Number(data.numberOfClasses || 0),
      images: data.images
        ? data.images.split(",").map((image) => image.trim()).filter(Boolean)
        : [],
    };

    try {
      const method = editingBranch ? "PATCH" : "POST";
      const url = editingBranch ? `/api/branches/${editingBranch.id}` : "/api/branches";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Could not save branch");
        return;
      }

      await loadBranches();
      toast.success(editingBranch ? "Branch updated successfully" : "Branch created successfully");
      reset(defaultFormValues);
      setEditingBranch(null);
      setShowForm(false);
    } catch (error) {
      console.error("Save branch error:", error);
      toast.error("An error occurred while saving the branch");
    }
  };

  const handleDelete = async (branchId: string) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const response = await fetch(`/api/branches/${branchId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete branch");
        return;
      }

      toast.success("Branch deleted");
      await loadBranches();
    } catch (error) {
      console.error("Delete branch error:", error);
      toast.error("An error occurred while deleting the branch");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Branches</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add, edit, and remove branch locations with secure admin access.
              </p>
            </div>
          </div>
          <Button onClick={() => openForm()} className="flex items-center gap-2">
            <FaPlus /> Add Branch
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {editingBranch ? "Edit Branch" : "Create New Branch"}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Branch location details, GPS coordinates and gallery images.
                  </p>
                </div>
                <Button variant="outline" onClick={() => openForm(editingBranch || undefined)}>
                  Reset form
                </Button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Branch Name"
                  placeholder="Anointed Trinity Pre-school"
                  {...register("name", { required: "Branch name is required" })}
                  error={errors.name?.message}
                />

                <Input
                  label="Address"
                  placeholder="84 Dorp Street, Polokwane Central"
                  {...register("address", { required: "Address is required" })}
                  error={errors.address?.message}
                />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Input
                    label="City"
                    placeholder="Polokwane"
                    {...register("city", { required: "City is required" })}
                    error={errors.city?.message}
                  />
                  <Input
                    label="Province"
                    placeholder="Limpopo"
                    {...register("province", { required: "Province is required" })}
                    error={errors.province?.message}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <Input label="Postal Code" placeholder="0700" {...register("postalCode")} />
                  <Input
                    label="Phone Number"
                    placeholder="+27 15 297 0755"
                    {...register("phoneNumber", { required: "Phone is required" })}
                    error={errors.phoneNumber?.message}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="branch@anointedtrinity.co.za"
                    {...register("email", { required: "Email is required" })}
                    error={errors.email?.message}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Input
                    label="Manager Name"
                    placeholder="Ms. Florence Madisha"
                    {...register("managerName")}
                  />
                  <Input
                    label="Opening Hours"
                    placeholder="Mon–Fri, 07:30 - 17:00"
                    {...register("openingHours")}
                  />
                </div>

                <Input
                  label="Number of Classes"
                  type="number"
                  placeholder="8"
                  {...register("numberOfClasses")}
                />

                <TextArea
                  label="Description"
                  placeholder="A warm, nurturing childcare environment in the heart of Polokwane."
                  {...register("description")}
                />

                <TextArea
                  label="Gallery Images"
                  placeholder="Separate image URLs with commas"
                  {...register("images")}
                  helperText="Use remote image URLs or public image paths."
                />

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button type="submit" isLoading={isSubmitting}>
                    {editingBranch ? "Save updates" : "Create branch"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <Card className="p-8 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500" />
          </Card>
        ) : branches.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{branch.name}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{branch.city}, {branch.province}</p>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        <span className="font-semibold text-slate-900 dark:text-white">Location:</span> {branch.address}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900 dark:text-white">Phone:</span> {branch.phoneNumber}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900 dark:text-white">Manager:</span> {branch.managerName || "Not assigned"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" variant="outline" onClick={() => openForm(branch)}>
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(branch.id)}
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
            <p className="text-slate-600 dark:text-slate-400 mb-4">No branches have been added yet.</p>
            <Button onClick={() => openForm()}>Add First Branch</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
