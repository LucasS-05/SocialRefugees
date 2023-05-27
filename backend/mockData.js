import mongoose from "mongoose";

const userId = [
  new mongoose.Types.ObjectId(),
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
];

export const users = [
  {
    _id: userId[0],
    name: "Ana",
    email: "nunume@yahoo.com",
    phone: "0774022123",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "image.jpg",
    role: "refugee",
    location: "Brad, Hunedoara",
    group: groupId[0],
  },
  {
    _id: userId[3],
    name: "Ana Cameliu Ionut",
    email: "numeprenume@gmail.comm",
    phone: "0712345678",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "image5.jpg",
    role: "refugee",
    location: "Ukraine, Hunedoara",
    group: groupId[1],
  },
  {
    _id: userId[2],
    name: "Asociatia X",
    email: "office@asociatie.com",
    phone: "0712345670",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "image.jpg",
    role: "admin",
    location: "Deva, Hunedoara",
    group: groupId[3],
  },
  {
    _id: userId[1],
    name: "Alex",
    email: "naseara@gmail.com",
    phone: "0735656781",
    password: "$2b$10$XrScUg38CKbg2XSW7koX3OuW.ZOegiys9tyw9FagUdi93bojMtnkS",
    picturePath: "image2.jpg",
    role: "helper",
    location: "Petrosani, Hunedoara",
  },
];

export const group = [
  {
    _id: groupId[0],
    ownerId: userId[0],
    administeredBy: userId[2],
    members: [userId[0], userId[1]],
    needs: ["apa", "mancare"],
    urgency: "urgent",
  },
  {
    _id: groupId[1],
    ownerId: userId[0],
    administeredBy: userId[2],
    members: [userId[0], userId[1]],
    needs: ["apa", "cazare"],
    urgency: "none",
  },
  {
    _id: groupId[2],
    ownerId: userId[0],
    administeredBy: userId[2],
    members: [userId[0], userId[1], userId[3]],
    needs: ["haine", "cazare"],
    urgency: "none",
  },
  {
    _id: groupId[3],
    ownerId: userId[0],
    administeredBy: userId[2],
    members: [userId[3], userId[1]],
    needs: ["apa", "cazare", "mancare", "bani"],
    urgency: "none",
  },
  {
    _id: groupId[4],
    ownerId: userId[0],
    administeredBy: userId[2],
    members: [userId[0]],
    needs: ["cazare"],
    urgency: "none",
  },
  {
    _id: groupId[5],
    ownerId: userId[0],
    administeredBy: userId[2],
    members: [userId[0], userId[1], userId[3]],
    needs: ["cazare", "resurse"],
    urgency: "none",
  },
];
