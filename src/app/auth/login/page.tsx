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

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Login successful!");
        
        if (result.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/portal");
        }
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
            <div className="mb-4">
              <img src="/logo.png" alt="ATCP logo" className="mx-auto h-16 w-auto rounded-lg bg-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Anointed Trinity
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Creche & Pre School</p>
          </div>

          {/* Form Card */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Sign in to your account
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                <Link
                  href="#"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Or
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </Card>

          {/* Admin Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you an admin?{" "}
              <Link
                href="/admin/login"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold"
              >
                Admin Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
