import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
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

const Group = mongoose.model("Group", groupSchema);

export default Group;
