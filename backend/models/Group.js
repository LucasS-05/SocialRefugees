import mongoose from "mongoose";

const groupSchema = mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    needs: {
      type: Array,
    },
    urgency: String,
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
