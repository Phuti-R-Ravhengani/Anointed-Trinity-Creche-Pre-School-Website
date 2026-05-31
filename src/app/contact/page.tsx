"use client";

import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Section, SectionTitle } from "@/components/sections/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <MainLayout>
      <Section className="bg-gray-50 dark:bg-gray-800">
        <SectionTitle
          title="Get in Touch"
          subtitle="We'd love to hear from you"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {[
              {
                icon: FaPhone,
                title: "Phone",
                content: "+27 (0)1 234 5678",
                link: "tel:+27123456789",
              },
              {
                icon: FaEnvelope,
                title: "Email",
                content: "info@anointedtrinity.co.za",
                link: "mailto:info@anointedtrinity.co.za",
              },
              {
                icon: FaMapMarkerAlt,
                title: "Address",
                content: "123 Education Ave, Johannesburg, South Africa",
                link: "#",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <Icon className="text-3xl text-primary-500 mb-4" />
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <a
                      href={item.link}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {item.content}
                    </a>
                  </Card>
                </motion.div>
              );
            })}

            {/* Quick Links */}
            <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-700">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-center" size="sm">
                  WhatsApp Us
                </Button>
                <Button
                  className="w-full justify-center"
                  variant="outline"
                  size="sm"
                >
                  Book a Visit
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    placeholder="John Doe"
                    {...register("name", {
                      required: "Name is required",
                    })}
                    error={errors.name?.message}
                  />
                  <Input
                    label="Your Email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    error={errors.email?.message}
                  />
                </div>

                <Input
                  label="Phone Number"
                  placeholder="+27..."
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  error={errors.phone?.message}
                />

                <TextArea
                  label="Message"
                  placeholder="Tell us how we can help..."
                  rows={6}
                  {...register("message", {
                    required: "Message is required",
                  })}
                  error={errors.message?.message}
                />

                <Button type="submit" size="lg" isLoading={isSubmitting}>
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="overflow-hidden h-96">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              title="Anointed Trinity Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.8715253635757!2d28.04639537520641!3d-26.20732627456179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c51a7c8c2b3%3A0x7c5e7e7e7e7e7e7e!2sJohannesburg%2C%20South%20Africa!5e0!3m2!1sen!2s!4v1234567890"
              loading="lazy"
            ></iframe>
          </Card>
        </motion.div>
      </Section>
    </MainLayout>
  );
}
