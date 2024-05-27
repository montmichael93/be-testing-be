import { prisma } from "../prisma/db";
import express from "express";
import cors from "cors";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { User } from "@prisma/client";

const app = express();
app.use(express.json()).use(
  cors({
    origin: ["http://localhost:3001"],
  })
);
app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.get("/users", async (_req, res) => {
  const allUsers = await prisma.user.findMany();
  res.send(allUsers);
});

app.get("/messages", async (_req, res) => {
  const allMessages = await prisma.message.findMany();
  res.send(allMessages);
});

app.post(
  "/messages",
  validateRequest({
    body: z.object({
      name: z.string(),
      email: z.string().email(),
      subject: z.string(),
      content: z.string(),
    }),
  }),
  async (req, res) => {
    let user: User;

    const foundUser = await prisma.user.findUnique({
      where: {
        email: req.body.email.toLowerCase(),
      },
    });
    console.log(foundUser);
    if (!foundUser) {
      user = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email.toLowerCase(),
        },
      });
    } else {
      user = foundUser;
      console.log(user);
    }
    const createMessage = await prisma.message
      .create({
        data: {
          subject: req.body.subject,
          content: req.body.content,
          senderId: user?.id!,
        },
      })
      .catch(() => null);
    if (!createMessage) {
      return res.status(500).json({ message: "message not sent" });
    }
    return res.json(createMessage);
  }
);

app.listen(3000);
