import mongoose from "mongoose";

const userId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

const groupId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const users = [
  {
    _id: userId[0],
    name: "Ana",
    email: "nunume@yahoo.com",
    phone: "0774022123",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "",
    role: "refugee",
    location: "Brad, Hunedoara",
    group: groupId[0],
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
      { user: userId[1], role: "user" }
    ],
    needs: ["apa", "mancare"],
    urgency: "urgent",
    helpedBy: []
  },
];
