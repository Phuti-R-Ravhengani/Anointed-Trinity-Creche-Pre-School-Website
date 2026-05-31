"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Section, SectionTitle } from "@/components/sections/Section";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { FaMedal, FaLightbulb, FaHeart, FaUsers } from "react-icons/fa";

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">About Anointed Trinity Creche & Pre School</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Where every child's potential is recognized, nurtured, and celebrated.
          </p>
        </div>
      </Section>

      {/* Our Story */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Founded in 2013, Anointed Trinity Creche & Pre School began with a simple vision: to provide
              exceptional early childhood education in a nurturing, faith-based environment.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              What started as a single classroom with 12 students has grown into a thriving
              educational community with multiple branches across South Africa, serving over 1000
              students annually.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our commitment to excellence, innovation, and holistic child development remains
              unwavering as we continue to shape young minds and hearts.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-96 rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src="/images/principal portrait.jpg"
              alt="Principal"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section className="bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            {
              icon: FaLightbulb,
              title: "Our Vision",
              content:
                "To be the leading provider of innovative, compassionate early childhood education that empowers every child to reach their fullest potential.",
            },
            {
              icon: FaHeart,
              title: "Our Mission",
              content:
                "To nurture the intellectual, emotional, social, and physical development of children in a safe, loving, and stimulating environment.",
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
                <Card className="p-8 h-full">
                  <Icon className="text-4xl text-primary-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {item.content}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Our Values */}
      <Section>
        <SectionTitle title="Our Core Values" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FaMedal,
              title: "Excellence",
              description: "Commitment to highest standards in education",
            },
            {
              icon: FaUsers,
              title: "Community",
              description: "Strong partnerships with families and society",
            },
            {
              icon: FaHeart,
              title: "Compassion",
              description: "Unconditional love and care for every child",
            },
            {
              icon: FaLightbulb,
              title: "Innovation",
              description: "Creative and modern teaching approaches",
            },
          ].map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <Icon className="text-4xl text-primary-500 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Leadership */}
      <Section className="bg-gray-50 dark:bg-gray-800">
        <SectionTitle title="Our Leadership Team" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Dr. Elizabeth Khubone",
              title: "Founder & Principal",
              bio: "30+ years in early childhood education",
            },
            {
              name: "Mr. James Okonkwo",
              title: "Director of Academics",
              bio: "M.Ed. in Curriculum Development",
            },
            {
              name: "Ms. Amelia de Villiers",
              title: "Head of Operations",
              bio: "Ensuring excellence across all branches",
            },
          ].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-6xl">
                  👨‍💼
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold mb-3">
                    {member.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Statistics */}
      <Section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "15+", label: "Years of Excellence" },
            { number: "1000+", label: "Happy Students" },
            { number: "50+", label: "Qualified Staff" },
            { number: "3", label: "Branches" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-4xl font-bold mb-2">{stat.number}</p>
              <p className="opacity-90">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </MainLayout>
  );
}
