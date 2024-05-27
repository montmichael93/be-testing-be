import { prisma } from "./db";

console.log("seeding...");

const clearDB = async () => {
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();
};

const seed = async () => {
  console.log("Seeding the database...");
  await clearDB();
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      name: "User One",
      message: {
        create: [
          {
            subject: "Hello",
            content: "Hello, this is a message from User One.",
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      name: "User Two",
      message: {
        create: [
          {
            subject: "Greetings",
            content: "Greetings, this is a message from User Two.",
          },
        ],
      },
    },
  });

  const message1 = await prisma.message.create({
    data: {
      subject: "Another Message",
      content: "This is another message from User One.",
      sender: {
        connect: { id: user1.id },
      },
    },
  });

  console.log({ user1, user2, message1 });
};

seed()
  .then(() => {
    console.log("seeded 🌱🌱🌱🌱🌱🌱🌱 ");
  })
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => {
    prisma.$disconnect;
  });
