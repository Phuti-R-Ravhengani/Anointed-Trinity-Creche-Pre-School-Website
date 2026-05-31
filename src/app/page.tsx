"use client";

import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Section, SectionTitle } from "@/components/sections/Section";
import { FaCalendar, FaImage, FaBullhorn, FaPhone } from "react-icons/fa";
import Link from "next/link";

interface Branch {
  id: string;
  name: string;
  city: string;
  numberOfClasses: number;
}

export default function Home() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        const data = await response.json();
        if (response.ok && data.branches) {
          setBranches(data.branches.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <MainLayout>
      <HeroSection />
      <WhyChooseUsSection />

      {/* Image Highlights */}
      <Section className="bg-white dark:bg-slate-900">
        <SectionTitle
          title="School Highlights"
          subtitle="Real moments from our classrooms"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              src: "/images/admissions%20open.jpg",
              alt: "Admissions open 2026",
            },
            {
              src: "/images/classroom%20activity.jpg",
              alt: "Classroom activity",
            },
            {
              src: "/images/literacy%20subjects.jpg",
              alt: "Literacy subjects",
            },
            {
              src: "/images/mascot%20event.jpg",
              alt: "Mascot event",
            },
          ].map((image) => (
            <div key={image.src} className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-56 object-cover"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* About Preview */}
      <Section className="bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/classroom%20activity.jpg"
                alt="Classroom activity at ATCP"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              About Anointed Trinity Creche & Pre School
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Established in 2013, Anointed Trinity Creche & Pre School has been a beacon
              of excellence in early childhood education. We pride ourselves on
              providing a nurturing environment where children can thrive
              academically, emotionally, and socially.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Our commitment to quality education, combined with our loving care,
              has made us a trusted choice for families across South Africa.
            </p>
            <Button size="lg">Learn More About Us</Button>
          </motion.div>
        </div>
      </Section>

      {/* Branches Preview */}
      <Section>
        <SectionTitle
          title="Our Branches"
          subtitle="Multiple locations for your convenience"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {loading ? (
            <p className="col-span-full text-center text-gray-600">Loading branches...</p>
          ) : branches.length > 0 ? (
            branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {branch.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {branch.city}
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                    {branch.numberOfClasses} Classrooms
                  </p>
                </Card>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No branches available</p>
          )}
        </div>
        <div className="text-center">
          <Link href="/branches">
            <Button variant="outline" size="lg">
              View All Branches
            </Button>
          </Link>
        </div>
      </Section>

      {/* Quick Links */}
      <Section dark>
        <SectionTitle
          title="Key Services"
          subtitle="Everything you need for your child's education"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FaPhone,
              title: "Book a Visit",
              description: "Schedule a tour of our facilities",
            },
            {
              icon: FaCalendar,
              title: "Events",
              description: "Check our upcoming events",
            },
            {
              icon: FaImage,
              title: "Gallery",
              description: "View photos from our activities",
            },
            {
              icon: FaBullhorn,
              title: "Announcements",
              description: "Stay updated with latest news",
            },
          ].map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center cursor-pointer hover:transform hover:scale-105 transition-transform">
                  <div className="inline-block w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                    <Icon className="text-2xl text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-300 text-sm">{service.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Enroll?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Give your child the best start in life with Anointed Trinity
            Pre-School.
          </p>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
            Start Enrollment Process
          </Button>
        </motion.div>
      </Section>
    </MainLayout>
  );
}
