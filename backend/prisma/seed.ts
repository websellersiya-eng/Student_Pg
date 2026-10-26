import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/infra/security/password.js";
import { toSlug } from "../src/shared/utils/slug.js";

const prisma = new PrismaClient();

const main = async () => {
  const adminPassword = await hashPassword("Admin@12345");

  await prisma.user.upsert({
    where: { email: "admin@nearstay.local" },
    update: {},
    create: {
      name: "NearStay Admin",
      email: "admin@nearstay.local",
      passwordHash: adminPassword,
      role: "ADMIN"
    }
  });

  const cities = [
    {
      name: "Indore",
      state: "Madhya Pradesh",
      localities: ["Vijay Nagar", "Bhawarkua", "Palasia", "Rau"]
    },
    {
      name: "Bhopal",
      state: "Madhya Pradesh",
      localities: ["MP Nagar", "Kolar Road", "Arera Colony"]
    },
    {
      name: "Jaipur",
      state: "Rajasthan",
      localities: ["Mansarovar", "Malviya Nagar", "Vaishali Nagar"]
    }
  ];

  for (const cityInput of cities) {
    const city = await prisma.city.upsert({
      where: { slug: toSlug(cityInput.name) },
      update: {},
      create: {
        name: cityInput.name,
        slug: toSlug(cityInput.name),
        state: cityInput.state
      }
    });

    for (const locality of cityInput.localities) {
      await prisma.locality.upsert({
        where: { cityId_slug: { cityId: city.id, slug: toSlug(locality) } },
        update: {},
        create: {
          cityId: city.id,
          name: locality,
          slug: toSlug(locality)
        }
      });
    }
  }

  const amenities = ["WiFi", "Meals", "Laundry", "Parking", "CCTV", "Power Backup", "Study Table"];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { slug: toSlug(amenity) },
      update: {},
      create: {
        name: amenity,
        slug: toSlug(amenity)
      }
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
