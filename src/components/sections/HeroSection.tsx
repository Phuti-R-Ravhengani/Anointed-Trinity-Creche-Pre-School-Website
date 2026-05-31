"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FaArrowRight } from "react-icons/fa";

export const HeroSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sunshine-50 via-secondary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #0b8eff 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, #eb5757 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, #0b8eff 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants}>
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              variants={itemVariants}
            >
              Welcome to{" "}
              <span className="flex flex-wrap gap-1 items-center">
                <span className="text-yellow-500">A</span>
                <span className="text-red-500">T</span>
                <span className="text-blue-500">C</span>
                <span className="text-green-500">P</span>
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Where young minds flourish in an environment of love, care, and quality education. Join our community of nurturing educators dedicated to your child's growth.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Button size="lg" className="group">
                Enroll Now
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Book a Visit
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-gray-200 dark:border-gray-700"
              variants={itemVariants}
            >
              {[
                { number: "15+", label: "Years of Excellence" },
                { number: "1000+", label: "Happy Students" },
                { number: "50+", label: "Qualified Staff" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-primary-600">
                    {stat.number}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
            variants={itemVariants}
          >
            <img
              src="/images/new%20month.jpg"
              alt="Children learning at ATCP"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
