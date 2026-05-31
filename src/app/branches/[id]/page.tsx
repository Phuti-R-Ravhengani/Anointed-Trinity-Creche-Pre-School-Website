import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface BranchPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BranchPageProps) {
  const branch = await prisma.branch.findUnique({
    where: { id: params.id },
    select: {
      name: true,
      city: true,
      province: true,
      description: true,
    },
  });

  if (!branch) {
    return {
      title: "Branch not found | Anointed Trinity",
      description: "The requested branch does not exist.",
    };
  }

  return {
    title: `${branch.name} | Anointed Trinity Pre-School`,
    description:
      branch.description ||
      `Visit ${branch.name} in ${branch.city}, ${branch.province}. Get contact details, hours and directions.`,
  };
}

export default async function BranchDetailsPage({ params }: BranchPageProps) {
  const branch = await prisma.branch.findUnique({
    where: { id: params.id },
  });

  if (!branch) {
    notFound();
  }

  // Parse JSON fields for compatibility
  const parsedImages = typeof branch.images === 'string' ? JSON.parse(branch.images || '[]') : branch.images;

  const getDirectionsUrl = branch.latitude && branch.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`;

  const whatsappUrl = `https://wa.me/${branch.phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hello ${branch.name}, I am interested in your preschool branch.`
  )}`;

  const embedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedSrc = embedKey
    ? `https://www.google.com/maps/embed/v1/place?key=${embedKey}&q=${encodeURIComponent(
        `${branch.latitude || ""},${branch.longitude || ""}`
      )}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300 font-semibold">
              Branch details
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              {branch.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              {branch.description || "A welcoming preschool location with trusted care and modern facilities."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              WhatsApp us
            </a>
            <a
              href={getDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
            >
              Get directions
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.65fr_0.35fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              {embedSrc ? (
                <iframe
                  title={`${branch.name} location`}
                  src={embedSrc}
                  className="h-72 w-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="flex h-72 items-center justify-center bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Live map preview unavailable. Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable.
                </div>
              )}

              <div className="p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Address</p>
                <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {branch.address}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {branch.city}, {branch.province} {branch.postalCode}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">South Africa</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-semibold">
                      Phone
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                      <a href={`tel:${branch.phoneNumber}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                        {branch.phoneNumber}
                      </a>
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-semibold">
                      Hours
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                      {branch.openingHours || "Mon – Fri, 07:30 – 17:00"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Branch summary</h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">
                    {branch.managerName ? `Campus managed by ${branch.managerName}.` : "Contact information and operating details are available below."}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-semibold">Email</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      <a href={`mailto:${branch.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                        {branch.email}
                      </a>
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-semibold">Coordinates</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      {branch.latitude?.toFixed(6)}, {branch.longitude?.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <div className="p-6">
                <h2 className="text-2xl font-semibold">Gallery</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Real branch imagery for families looking for the right campus.
                </p>
              </div>
              <div className="grid gap-3 p-6 sm:grid-cols-2">
                {parsedImages && parsedImages.length > 0 ? (
                  parsedImages.map((image: string, index: number) => (
                    <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
                      <Image
                        src={image}
                        alt={`${branch.name} gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    No gallery images available for this branch.
                  </div>
                )}
              </div>
            </Card>

            <Card className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Nearby directions</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Use Google Maps to navigate directly to the campus from your current location.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={getDirectionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-2.5 text-base font-semibold text-white transition-all duration-200 hover:bg-primary-600 shadow-lg hover:shadow-xl"
                  >
                    Open Google Maps
                  </Link>
                  <Link
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-500 px-6 py-2.5 text-base font-semibold text-primary-500 transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  >
                    Message on WhatsApp
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
