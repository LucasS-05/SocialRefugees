import mongoose from "mongoose";
import { generateShortId } from "./generateId.js";

const userId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

const groupId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const users = [
  {
    _id: userId[2],
    name: "Refgiu Helper SRL",
    email: "refugiu@gmail.com",
    phone: "0762248485",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "",
    role: "admin",
    location: "Hunedoara, Sediu 14 Avramescu 14",
    owns: groupId[0],
  },
  {
    _id: userId[0],
    name: "Ana",
    email: "nunume@yahoo.com",
    phone: "0774022123",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "",
    role: "helper",
    location: "Brad, Hunedoara",
  },
  {
    _id: userId[1],
    name: "Ana Cameliu Ionut",
    email: "numeprenume@gmail.com",
    phone: "0712345678",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "",
    role: "refugee",
    location: "Ukraine, Hunedoara",
    group: groupId[1],
  },
];

export const group = [
  {
    _id: groupId[0],
    ownerId: userId[0],
    members: [
      { user: userId[0], role: "admin" },
      { user: userId[1], role: "user", status: "accepted" }
    ],
    needs: ["apa", "mancare"],
    urgency: "urgent",
    shortId: generateShortId(),
    helpedBy: []
  },
];
