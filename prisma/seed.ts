import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

async function main() {
  await prisma.application.deleteMany();
  await prisma.child.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();

  const branches = await Promise.all([
    prisma.branch.create({
      data: {
        name: "Anointed Trinity Pre-school",
        address: "84 Dorp St, Polokwane Central, Polokwane, 0700",
        city: "Polokwane Central",
        province: "Limpopo",
        postalCode: "0700",
        country: "South Africa",
        phoneNumber: "0152970755",
        email: "polokwane@anointedtrinity.co.za",
        managerName: "Ms. Grace Makhura",
        openingHours: "Mon–Fri, 06:30 – 17:30",
        numberOfClasses: 10,
        latitude: -23.9045,
        longitude: 29.4689,
        description: "Central Polokwane preschool with warm care, interactive classrooms and aftercare support.",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1513628253939-010e64ac66cd?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        ]),
      },
    }),
    prisma.branch.create({
      data: {
        name: "Anointed Trinity Creche And Pre-School",
        address: "Stand No 610, Mankweng, Polokwane, Limpopo, South Africa",
        city: "Mankweng",
        province: "Limpopo",
        postalCode: "0000",
        country: "South Africa",
        phoneNumber: "+27 15 257 0084",
        email: "mankweng@anointedtrinity.co.za",
        managerName: "Mr. Sipho Ndlovu",
        openingHours: "Mon–Fri, 07:30 – 17:00",
        numberOfClasses: 8,
        latitude: -23.8902,
        longitude: 29.7167,
        description: "Trusted Mankweng campus offering structured care and learning for toddlers and preschoolers.",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1507537287725-24d43d3e4443?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
        ]),
      },
    }),
    prisma.branch.create({
      data: {
        name: "Anointed Trinity Creche & Pre-School",
        address: "Maniini, Thohoyandou, Limpopo, South Africa",
        city: "Thohoyandou",
        province: "Limpopo",
        postalCode: "0950",
        country: "South Africa",
        phoneNumber: "+27 79 116 4691",
        email: "thohoyandou@anointedtrinity.co.za",
        managerName: "Ms. Thandiwe Ramashala",
        openingHours: "Mon–Fri, 07:30 – 17:00",
        numberOfClasses: 7,
        latitude: -22.9760,
        longitude: 30.4453,
        description: "Family-friendly Thohoyandou branch with rich learning opportunities and safe childcare.",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=1200&q=80",
        ]),
      },
    }),
  ]);

  const adminPassword = await hashPassword("Admin@1234");

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@anointedtrinity.co.za",
      password: adminPassword,
      firstName: "Admin",
      lastName: "Trinity",
      phoneNumber: "+27 79 000 0000",
      role: "ADMIN",
    },
  });

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      permissions: JSON.stringify(["all"]),
    },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
