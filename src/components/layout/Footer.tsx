"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Quick Links": [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Branches", href: "/branches" },
      { label: "Events", href: "/events" },
    ],
    Services: [
      { label: "Admissions", href: "/admissions" },
      { label: "Gallery", href: "/gallery" },
      { label: "Parent Portal", href: "/portal" },
      { label: "Contact Us", href: "/contact" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 pb-12 border-b border-gray-800">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="ATCP logo" className="h-10 w-auto rounded-lg bg-white" />
              <div>
                <p className="font-bold">Anointed Trinity</p>
                <p className="text-xs text-gray-400">Creche & Pre School</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Nurturing young minds with love, care, and quality education.
            </p>
            <div className="flex gap-4">
              {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2">
                <FaPhone className="text-primary-400" />
                <a href="tel:+27123456789" className="hover:text-white">
                  +27 (0)1 234 5678
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-primary-400" />
                <a href="mailto:info@anointedtrinity.co.za" className="hover:text-white">
                  info@anointedtrinity.co.za
                </a>
              </div>
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-primary-400 mt-1" />
                <span>South Africa</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-gray-400 text-sm">
          <p>&copy; {currentYear} Anointed Trinity Creche & Pre School. All rights reserved.</p>
          <p>Made with ❤️ for quality education</p>
        </div>
      </div>
    </footer>
  );
};
