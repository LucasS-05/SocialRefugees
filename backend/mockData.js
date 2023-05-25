
import mongoose from "mongoose";

const userId = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

const groupId = new mongoose.Types.ObjectId();

export const users = [
  {
    _id: userId[0],
    name: "Ana",
    email: "numeprenume@gmail.com",
    phone : "0712345678",
    password: "hash64",
    picturePath: "image.jpg",
    role: ["admin"],
    location: "Deva, Hunedoara",
    group: groupId,
  },
  {
    _id: userId[1],
    name: "Alex",
    email: "naseara@gmail.com",
    phone : "073565678",
    password: "hash128",
    picturePath: "image2.jpg",
    role: ["refugee"],
    location: "Petrosani, Hunedoara",
  }
]

export const group = [
  {
    _id: groupId[0],
    ownerId: userId[0],
    users : [userId[0], userId[1]],
    needs: ["apa", "mancare"],
    urgency: "urgent",
  }
]
