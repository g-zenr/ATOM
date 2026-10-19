import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "me@atom.local" },
    create: { email: "me@atom.local", name: "Me" },
    update: {},
  });

  await prisma.note.create({
    data: {
      title: "Welcome to ATOM",
      content:
        "Everything that makes your day work.\n\nThis note came from `packages/db/prisma/seed.ts`. " +
        "Notes, tasks, and time entries are all editable from the dashboard.",
      tags: ["getting-started"],
      userId: user.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Explore the dashboard",
        status: "TODO",
        priority: "HIGH",
        userId: user.id,
      },
      {
        title: "Clock in and out once",
        status: "TODO",
        priority: "MEDIUM",
        userId: user.id,
      },
      {
        title: "Read Project Atom.md",
        status: "DONE",
        priority: "LOW",
        userId: user.id,
      },
    ],
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  await prisma.timeEntry.create({
    data: {
      start: new Date(today.getTime() + 9 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 17 * 60 * 60 * 1000),
      duration: 8 * 60 * 60,
      date: today,
      note: "Sample session — edit or delete freely",
      userId: user.id,
    },
  });

  console.log("Seeded ATOM for user", user.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
