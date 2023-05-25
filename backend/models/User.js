import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 30,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      //Default profile pic in assets
      default: "",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    role: {
      type: [String],
      enum: ["guest", "refugee", "helper", "admin"],
      default: ["guest"],
    },
    location: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
