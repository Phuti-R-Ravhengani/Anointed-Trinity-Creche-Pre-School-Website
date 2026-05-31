"use client";

import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Section, SectionTitle } from "@/components/sections/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { FaCalendar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  category: string;
  rsvpCount: number;
  capacity?: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Dummy data
    const dummyEvents = [
      {
        id: "1",
        title: "Annual Sports Day",
        description: "Join us for a day of exciting sports competitions and activities.",
        startDate: "2024-06-15",
        endDate: "2024-06-15",
        location: "Main Campus Grounds",
        category: "SPORTS_DAY",
        rsvpCount: 25,
        capacity: 100,
      },
      {
        id: "2",
        title: "Cultural Festival",
        description: "Celebrate diversity through music, dance, and cultural performances.",
        startDate: "2024-07-01",
        endDate: "2024-07-02",
        location: "Main Auditorium",
        category: "CULTURAL_PROGRAM",
        rsvpCount: 40,
        capacity: 150,
      },
      {
        id: "3",
        title: "Parent-Teacher Meeting",
        description: "Discuss your child's progress and learning goals.",
        startDate: "2024-06-28",
        endDate: "2024-06-28",
        location: "School Conference Room",
        category: "PARENT_MEETING",
        rsvpCount: 32,
        capacity: 60,
      },
    ];
    setEvents(dummyEvents);
  }, []);

  const upcomingEvents = events.filter(
    (event) => new Date(event.startDate) >= new Date()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <MainLayout>
      <Section className="bg-gray-50 dark:bg-gray-800">
        <SectionTitle
          title="Events & Announcements"
          subtitle="Stay updated with our latest events"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events List */}
          <div className="lg:col-span-2 space-y-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="md:flex">
                      {/* Date Box */}
                      <div className="md:w-32 bg-gradient-to-br from-primary-500 to-secondary-500 text-white p-6 flex flex-col items-center justify-center">
                        <p className="text-4xl font-bold">
                          {new Date(event.startDate).getDate()}
                        </p>
                        <p className="text-sm uppercase">
                          {new Date(event.startDate).toLocaleString("default", {
                            month: "short",
                          })}
                        </p>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                          {event.title}
                        </h3>

                        <Badge variant="info" className="mb-4">
                          {event.category.replace("_", " ")}
                        </Badge>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {event.description}
                        </p>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <FaCalendar />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.capacity && (
                            <div className="flex items-center gap-2">
                              <FaUsers />
                              <span>
                                {event.rsvpCount} / {event.capacity} RSVPs
                              </span>
                            </div>
                          )}
                        </div>

                        <Button size="sm">RSVP Now</Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No upcoming events at the moment.
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Button size="md" className="w-full">
                  View Calendar
                </Button>
                <Button size="md" variant="outline" className="w-full">
                  Subscribe to Updates
                </Button>
                <Button size="md" variant="outline" className="w-full">
                  Contact Organizer
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3">Latest Announcements</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      School Holiday
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      June 15 - July 5
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
