import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    nume: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    location: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
