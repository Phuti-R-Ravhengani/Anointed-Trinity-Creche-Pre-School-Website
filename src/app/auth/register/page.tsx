"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
    useForm<RegisterFormData>();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Registration successful!");
        router.push("/portal");
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred");
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
              <img src="/logo.svg" alt="ATCP logo" className="mx-auto h-16 w-auto rounded-lg bg-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Anointed Trinity
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Creche & Pre School</p>
          </div>

          {/* Form Card */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
              Create Account
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Join our community
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="First"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  error={errors.firstName?.message}
                />
                <Input
                  label="Last Name"
                  placeholder="Last"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  error={errors.lastName?.message}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
                error={errors.email?.message}
              />

              <Input
                label="Phone Number"
                placeholder="+27..."
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
                error={errors.phoneNumber?.message}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                error={errors.password?.message}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Please confirm password",
                })}
                error={errors.confirmPassword?.message}
              />

              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 rounded border-gray-300"
                  required
                />
                <span className="text-gray-600 dark:text-gray-400">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>

              <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
