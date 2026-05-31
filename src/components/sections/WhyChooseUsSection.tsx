"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { SectionTitle, Section } from "./Section";
import {
  FaHeart,
  FaBook,
  FaStar,
  FaUsers,
  FaShieldAlt,
  FaTree,
} from "react-icons/fa";

export const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: FaHeart,
      title: "Loving Care",
      description:
        "Our passionate teachers provide individualized attention to every child.",
    },
    {
      icon: FaBook,
      title: "Quality Education",
      description:
        "Evidence-based curriculum designed for early childhood development.",
    },
    {
      icon: FaStar,
      title: "Excellence",
      description:
        "Commitment to delivering the highest standards in education.",
    },
    {
      icon: FaUsers,
      title: "Community",
      description:
        "Strong partnerships between school, parents, and families.",
    },
    {
      icon: FaShieldAlt,
      title: "Safe Environment",
      description:
        "State-of-the-art facilities with strict safety protocols.",
    },
    {
      icon: FaTree,
      title: "Holistic Development",
      description:
        "Academic, emotional, social, and physical growth for every child.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <Section>
      <SectionTitle
        title="Why Choose Anointed Trinity?"
        subtitle="Excellence in Early Childhood Education"
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-6 h-full">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Icon className="text-white text-xl" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
};
