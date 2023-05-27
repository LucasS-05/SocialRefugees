import mongoose from "mongoose";

const groupSchema = mongoose.Schema(
  {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
