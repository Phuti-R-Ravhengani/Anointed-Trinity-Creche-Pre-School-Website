"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface AdminLoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<AdminLoginFormData>();

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.user.role !== "ADMIN") {
          toast.error("Admin access required");
          return;
        }

        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg mx-auto flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">AT</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Anointed Trinity
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Admin Portal</p>
          </div>

          {/* Form Card */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
              Admin Sign In
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Restricted access
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@anointedtrinity.co.za"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                })}
                error={errors.password?.message}
              />

              <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                Sign In
              </Button>
            </form>

            {/* Back Link */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
              Not an admin?{" "}
              <Link
                href="/auth/login"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold"
              >
                Return to login
              </Link>
            </p>
          </Card>

          {/* Security Notice */}
          <motion.div
            className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ This is a restricted area. Unauthorized access is prohibited.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
