"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Section, SectionTitle } from "@/components/sections/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaSearch,
  FaExternalLinkAlt,
  FaWhatsapp,
} from "react-icons/fa";

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  managerName?: string;
  openingHours?: string;
  numberOfClasses: number;
  images: string[];
  description?: string;
  latitude?: number;
  longitude?: number;
}

const googleDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#383838" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }],
  },
];

const loadGoogleMapsApi = (apiKey: string) => {
  return new Promise<any>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window object is not available"));
      return;
    }

    if ((window as any).google?.maps) {
      resolve((window as any).google.maps);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google?.maps) {
        resolve((window as any).google.maps);
      } else {
        reject(new Error("Google Maps failed to load"));
      }
    };
    script.onerror = () => reject(new Error("Google Maps script failed to load"));
    document.head.appendChild(script);
  });
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const filteredBranches = useMemo(() => {
    if (!search.trim()) return branches;
    const query = search.toLowerCase();
    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(query) ||
        branch.city.toLowerCase().includes(query) ||
        branch.province.toLowerCase().includes(query) ||
        branch.address.toLowerCase().includes(query)
    );
  }, [branches, search]);

  const activeBranch = useMemo(
    () => branches.find((branch) => branch.id === selectedBranchId) || branches[0],
    [branches, selectedBranchId]
  );

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch branches");
        }

        setBranches(data.branches || []);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        setFetchError("Unable to load branches. Please check your database seed and API configuration.");
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    if (!loading && branches.length && !selectedBranchId) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches, loading, selectedBranchId]);

  useEffect(() => {
    if (loading || branches.length === 0 || !mapContainerRef.current) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapError("Google Maps API key is missing. Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.");
      return;
    }

    let cleanup = false;

    const initializeMap = async () => {
      try {
        const maps = await loadGoogleMapsApi(apiKey);
        if (cleanup) return;

        const firstBranch = branches.find((branch) => branch.latitude && branch.longitude);
        const map = new maps.Map(mapContainerRef.current!, {
          center: firstBranch
            ? { lat: firstBranch.latitude!, lng: firstBranch.longitude! }
            : { lat: -23.9, lng: 29.5 },
          zoom: 10,
          disableDefaultUI: false,
          styles: googleDarkStyle,
        });

        const bounds = new maps.LatLngBounds();
        markersRef.current = [];

        branches.forEach((branch) => {
          if (!branch.latitude || !branch.longitude) return;

          const marker = new maps.Marker({
            position: { lat: branch.latitude, lng: branch.longitude },
            map,
            title: branch.name,
            animation: maps.Animation.DROP,
            icon: {
              path: maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 5,
              fillColor: "#10b981",
              fillOpacity: 1,
              strokeWeight: 1.5,
              strokeColor: "#ffffff",
            },
          });

          marker.addListener("click", () => {
            setSelectedBranchId(branch.id);
            map.panTo(marker.getPosition() as any);
            map.setZoom(13);
          });

          markersRef.current.push(marker);
          bounds.extend(marker.getPosition() as any);
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, 80);
        }

        mapRef.current = map;
        setMapError(null);
      } catch (error) {
        console.error("Google Maps initialization failed:", error);
        setMapError("Unable to load the live map. Please check your API key and network connection.");
      }
    };

    initializeMap();

    return () => {
      cleanup = true;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [branches, loading]);

  useEffect(() => {
    if (!selectedBranchId || !mapRef.current || markersRef.current.length === 0) return;

    const selectedMarker = markersRef.current.find(
      (marker) => marker.getTitle() === activeBranch?.name
    );

    if (selectedMarker) {
      const position = selectedMarker.getPosition();
      if (position) {
        mapRef.current.panTo(position);
        mapRef.current.setZoom(13);
      }
    }
  }, [selectedBranchId, activeBranch]);

  const formatWhatsAppLink = (phone: string, label: string) => {
    const digits = phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(`Hello ${label}, I would like to learn more about your pre-school branch.`);
    return `https://wa.me/${digits}?text=${text}`;
  };

  const buildGoogleMapsUrl = (branch: Branch) => {
    if (branch.latitude && branch.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`;
  };

  const branchStats = useMemo(() => ({
    totalBranches: branches.length,
    totalClasses: branches.reduce((acc, branch) => acc + (branch.numberOfClasses || 0), 0),
    cities: Array.from(new Set(branches.map((branch) => branch.city))).join(", "),
  }), [branches]);

  return (
    <MainLayout>
      <Section className="bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400 font-semibold">
              Campuses & Branches
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
              Explore Anointed Trinity branches in Limpopo
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
              Interactive branch locations, live directions, WhatsApp contact and operating hours for every campus.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-primary-600/10 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300 font-semibold">
                    Branches
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                    {branchStats.totalBranches}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    real, live branches served every day.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-100 dark:bg-slate-800 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 font-semibold">
                    Total classes
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                    {branchStats.totalClasses}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    classrooms and learning spaces across branches.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-100 dark:bg-slate-800 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 font-semibold">
                    Cities served
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                    {branchStats.cities}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900 text-white border border-slate-800">
              <div className="flex flex-col gap-3">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                  Live branch map
                </p>
                <h2 className="text-3xl font-bold">View every branch location</h2>
                <p className="text-slate-300">
                  Click a branch card to zoom into its campus and open directions in Google Maps.
                </p>
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <div ref={mapContainerRef} className="h-96 w-full bg-slate-800" />
                </div>
                {mapError ? (
                  <p className="text-sm text-red-300">{mapError}</p>
                ) : (
                  <p className="text-sm text-slate-400">
                    Interactive map powered by Google Maps Javascript API.
                  </p>
                )}
              </div>
            </Card>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.65fr_0.35fr]">
            <div>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Branch directory
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Filter branches by name, city or province and discover full contact details.
                  </p>
                </div>
                <div className="relative max-w-md">
                  <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
                    placeholder="Search branches, cities, or addresses"
                    aria-label="Search branches"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {!loading && fetchError ? (
                  <div className="rounded-4xl border border-rose-300 bg-rose-50 p-6 text-rose-900 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-200">
                    {fetchError}
                  </div>
                ) : null}
                {!loading && !fetchError && filteredBranches.length === 0 ? (
                  <div className="rounded-4xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    No branches are available yet. Run the seed script or add branches through the admin dashboard.
                  </div>
                ) : null}
                {filteredBranches.map((branch, index) => (
                  <motion.div
                    key={branch.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`rounded-4xl border p-6 shadow-sm transition-all duration-300 ${
                      selectedBranchId === branch.id
                        ? "border-primary-500/30 bg-primary-50 dark:border-cyan-400/30 dark:bg-slate-900"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                    }`}
                    onClick={() => setSelectedBranchId(branch.id)}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600/10 text-primary-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                            <FaMapMarkerAlt />
                          </span>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                              {branch.name}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {branch.city}, {branch.province}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                          {branch.description || "Per-child support, safe learning spaces and modern classrooms."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={selectedBranchId === branch.id ? "primary" : "outline"}
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedBranchId(branch.id);
                          }}
                        >
                          Focus
                        </Button>
                        <Link
                          href={`/branches/${branch.id}`}
                          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                          onClick={(event) => event.stopPropagation()}
                        >
                          View details
                        </Link>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Operating hours
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                          {branch.openingHours || "Mon–Fri, 07:30 - 17:00"}
                        </p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Contact
                        </p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                          {branch.phoneNumber}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {branch.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <a
                        href={`tel:${branch.phoneNumber}`}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Call branch
                      </a>
                      <a
                        href={formatWhatsAppLink(branch.phoneNumber, branch.name)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-2xl border border-emerald-500 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/20 dark:border-emerald-400 dark:text-emerald-200"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <FaWhatsapp className="mr-2" /> WhatsApp
                      </a>
                      <a
                        href={buildGoogleMapsUrl(branch)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Open in Google Maps
                        <FaExternalLinkAlt className="ml-2" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {activeBranch?.name ?? "Selected branch"}
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {activeBranch?.description || "Select a branch to see the full address, gallery and hours."}
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Address</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{activeBranch?.address}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hours</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{activeBranch?.openingHours || "Mon–Fri, 07:30 - 17:00"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Manager</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{activeBranch?.managerName || "Campus leader"}</p>
                  </div>
                </div>

                {activeBranch?.images?.length ? (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {activeBranch.images.slice(0, 4).map((image, idx) => (
                      <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
                        <Image
                          src={image}
                          alt={`${activeBranch.name} gallery ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Gallery images will appear here once the branch is published.
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
