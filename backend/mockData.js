import mongoose from "mongoose";
import { generateShortId } from "./generateId.js";

const userId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

const groupId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const users = [
  {
    _id: userId[0],
    name: "Refgiu Helper SRL",
    email: "refugiu@gmail.com",
    phone: "0762248485",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "",
    role: "admin",
    location: "Hunedoara, Sediu 14 Avramescu 14",
    owns: [groupId[0]],
  },
  {
    _id: userId[1],
    name: "Ana",
    email: "ana@gmail.com",
    phone: "0774022123",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "",
    role: "refugee",
    location: "Brad, Oslo",
  },
  {
    _id: userId[2],
    name: "Alex",
    email: "alex@gmail.com",
    phone: "0774022124",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "",
    role: "helper",
    location: "Brad, Hunedoara",
  },
  {
    _id: userId[3],
    name: "Ana Cameliu Ionut",
    email: "cameliu@gmail.com",
    phone: "0712345675",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "",
    role: "refugee",
    location: "Ukraine, Hunedoara",
    group: groupId[1],
  },
  {
    _id: userId[4],
    name: "Andrei",
    email: "andrei@gmail.com",
    phone: "0712345676",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "",
    role: "refugee",
    location: "Ukraine, Australia",
    group: groupId[1],
  },
];

export const group = [
  {
    _id: groupId[0],
    ownerId: userId[1],
    members: [
      { user: userId[1], role: "admin" },
      { user: userId[2], role: "user", status: "accepted" },
      { user: userId[3], role: "user", status: "pending" }
    ],
    needs: ["apa", "mancare"],
    urgency: "urgent",
    shortId: generateShortId(),
  },
  {
    _id: groupId[1],
    ownerId: userId[3],
    members: [
      { user: userId[3], role: "admin" },
      { user: userId[4], role: "user", status: "accepted" },
    ],
    needs: ["apa", "mancare"],
    urgency: "urgent",
    shortId: generateShortId(),
    helpedBy: []
  },
];
