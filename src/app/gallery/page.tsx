"use client";

import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Section, SectionTitle } from "@/components/sections/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description?: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Dummy data
    const dummyImages = [
      {
        id: "1",
        title: "Mascot Celebration",
        image: "/images/mascot celebration.jpg",
        category: "EVENTS",
      },
      {
        id: "2",
        title: "Opening Announcement",
        image: "/images/opening announcement.jpg",
        category: "EVENTS",
      },
      {
        id: "3",
        title: "Awards Ceremony",
        image: "/images/awards ceremony.jpg",
        category: "EVENTS",
      },
      {
        id: "4",
        title: "Stage Performance",
        image: "/images/stage performance.jpg",
        category: "LEARNING_ACTIVITIES",
      },
      {
        id: "5",
        title: "Learning Activities",
        image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&h=400",
        category: "LEARNING_ACTIVITIES",
      },
      {
        id: "6",
        title: "Classroom Activity",
        image: "/images/classroom activity.jpg",
        category: "CLASSES",
      },
      {
        id: "7",
        title: "Graduation Group",
        image: "/images/graduation group.jpg",
        category: "EVENTS",
      },
      {
        id: "8",
        title: "Tech Learning",
        image: "/images/tech learning.jpg",
        category: "LEARNING_ACTIVITIES",
      },
    ];
    setImages(dummyImages);
  }, []);

  const categories = [
    { value: "all", label: "All" },
    { value: "CLASSES", label: "Classes" },
    { value: "EVENTS", label: "Events" },
    { value: "SPORTS", label: "Sports" },
    { value: "LEARNING_ACTIVITIES", label: "Learning Activities" },
  ];

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <MainLayout>
      <Section className="bg-gray-50 dark:bg-gray-800">
        <SectionTitle
          title="School Gallery"
          subtitle="Capturing moments of growth and joy"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === cat.value
                  ? "bg-primary-500 text-white shadow-lg"
                  : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-primary-500"
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              layoutId={image.id}
            >
              <Card className="overflow-hidden cursor-pointer group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
                    <div className="p-4 w-full bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="font-bold">{image.title}</h3>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </MainLayout>
  );
}
