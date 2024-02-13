import mongoose from "mongoose";
import { generateShortId } from "../generateId.js";

const groupSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      unique: true,
    },
    helpedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        needs: [
          { type: String }
        ],
        description: String,
      },
    ],
    administeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        _id: false,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["user", "admin"],
          default: "user",
        },
        status: {
          type: String,
          enum: ["none", "pending", "rejected", "accepted"],
          default: "none",
        },
      },
    ],
    needs: [
      {
        type: String,
      },
    ],
    urgency: String,
  },
  { timestamps: true }
);


groupSchema.pre('save', function(next) {
  if (!this.shortId) {
    this.shortId = generateShortId();
  }
  next();
});

const Group = mongoose.model("Group", groupSchema);

export default Group;

