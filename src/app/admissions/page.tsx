"use client";

import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Section, SectionTitle } from "@/components/sections/Section";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface AdmissionFormData {
  // Child Info
  childFirstName: string;
  childLastName: string;
  childDateOfBirth: string;
  childGender: string;
  // Parent Info
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  parentOccupation?: string;
  parentCompany?: string;
  // Contact
  address: string;
  city: string;
  province: string;
  postalCode: string;
  // Emergency
  emergencyName: string;
  emergencyPhone: string;
  emergencyEmail?: string;
  // Health
  allergies?: string;
  medicalNotes?: string;
  // Application
  branchId: string;
  classPreference?: string;
}

export default function AdmissionsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AdmissionFormData>();
  const [step, setStep] = useState(1);
  const [referenceNumber, setReferenceNumber] = useState("");

  const onSubmit = async (data: AdmissionFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });

      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setReferenceNumber(result.application.referenceNumber);
        setStep(4);
        toast.success("Application submitted successfully!");
        reset();
      } else {
        toast.error("Failed to submit application");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <Section className="bg-gray-50 dark:bg-gray-800">
        <SectionTitle
          title="Online Admission Form"
          subtitle="Register your child at Anointed Trinity Creche & Pre School"
        />

        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          {step < 4 && (
            <div className="mb-12">
              <div className="flex justify-between mb-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 rounded-full mx-2 transition-colors ${
                      s <= step ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Step {step} of 3
              </p>
            </div>
          )}

          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Child Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 className="text-2xl font-bold mb-6">Child Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        placeholder="First name"
                        {...register("childFirstName", {
                          required: "First name is required",
                        })}
                        error={errors.childFirstName?.message}
                      />
                      <Input
                        label="Last Name"
                        placeholder="Last name"
                        {...register("childLastName", {
                          required: "Last name is required",
                        })}
                        error={errors.childLastName?.message}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Date of Birth"
                        type="date"
                        {...register("childDateOfBirth", {
                          required: "Date of birth is required",
                        })}
                        error={errors.childDateOfBirth?.message}
                      />
                      <Select
                        label="Gender"
                        {...register("childGender", {
                          required: "Gender is required",
                        })}
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "other", label: "Other" },
                        ]}
                        error={errors.childGender?.message}
                      />
                    </div>

                    <TextArea
                      label="Allergies (if any)"
                      placeholder="List any known allergies..."
                      {...register("allergies")}
                      rows={3}
                    />

                    <TextArea
                      label="Medical Notes"
                      placeholder="Any medical conditions or notes..."
                      {...register("medicalNotes")}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={() => setStep(2)}>
                      Next
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Parent Information */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 className="text-2xl font-bold mb-6">Parent Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        {...register("parentFirstName", {
                          required: "First name is required",
                        })}
                        error={errors.parentFirstName?.message}
                      />
                      <Input
                        label="Last Name"
                        {...register("parentLastName", {
                          required: "Last name is required",
                        })}
                        error={errors.parentLastName?.message}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        type="email"
                        {...register("parentEmail", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email",
                          },
                        })}
                        error={errors.parentEmail?.message}
                      />
                      <Input
                        label="Phone Number"
                        {...register("parentPhone", {
                          required: "Phone number is required",
                        })}
                        error={errors.parentPhone?.message}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Occupation"
                        {...register("parentOccupation")}
                      />
                      <Input label="Company" {...register("parentCompany")} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Address"
                        {...register("address", {
                          required: "Address is required",
                        })}
                        error={errors.address?.message}
                      />
                      <Input
                        label="City"
                        {...register("city", {
                          required: "City is required",
                        })}
                        error={errors.city?.message}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Province"
                        {...register("province", {
                          required: "Province is required",
                        })}
                        options={[
                          { value: "gauteng", label: "Gauteng" },
                          {
                            value: "western-cape",
                            label: "Western Cape",
                          },
                          {
                            value: "kwazulu-natal",
                            label: "KwaZulu-Natal",
                          },
                          { value: "limpopo", label: "Limpopo" },
                          { value: "other", label: "Other" },
                        ]}
                        error={errors.province?.message}
                      />
                      <Input
                        label="Postal Code"
                        {...register("postalCode", {
                          required: "Postal code is required",
                        })}
                        error={errors.postalCode?.message}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between gap-4 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Previous
                    </Button>
                    <Button type="button" onClick={() => setStep(3)}>
                      Next
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Emergency & School Info */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 className="text-2xl font-bold mb-6">
                    Emergency Contact & School Preference
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Emergency Contact Name"
                      {...register("emergencyName", {
                        required: "Emergency contact name is required",
                      })}
                      error={errors.emergencyName?.message}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Emergency Contact Phone"
                        {...register("emergencyPhone", {
                          required: "Emergency contact phone is required",
                        })}
                        error={errors.emergencyPhone?.message}
                      />
                      <Input
                        label="Emergency Contact Email (optional)"
                        type="email"
                        {...register("emergencyEmail")}
                      />
                    </div>

                    <Select
                      label="Preferred Branch"
                      {...register("branchId", {
                        required: "Please select a branch",
                      })}
                      options={[
                        {
                          value: "branch-1",
                          label: "Johannesburg Branch",
                        },
                        { value: "branch-2", label: "Cape Town Branch" },
                        { value: "branch-3", label: "Durban Branch" },
                      ]}
                      error={errors.branchId?.message}
                    />

                    <Select
                      label="Preferred Class/Grade (optional)"
                      {...register("classPreference")}
                      options={[
                        { value: "nursery", label: "Nursery" },
                        { value: "toddler", label: "Toddler (1-2 years)" },
                        { value: "pre-k", label: "Pre-K (3-4 years)" },
                        { value: "reception", label: "Reception (4-5 years)" },
                      ]}
                    />
                  </div>

                  <div className="flex justify-between gap-4 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Previous
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                      Submit Application
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Success Message */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-3xl font-bold mb-4 text-green-600">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Thank you for applying to Anointed Trinity Creche & Pre School.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Your Application Reference Number:
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                      {referenceNumber}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Save this for your records
                    </p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    A confirmation email has been sent to your email address. We
                    will review your application and contact you within 3-5
                    business days.
                  </p>
                  <Button onClick={() => window.location.href = "/"}>
                    Return to Home
                  </Button>
                </motion.div>
              )}
            </form>
          </Card>
        </div>
      </Section>
    </MainLayout>
  );
}
