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
      default: "",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    owns: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Group",
    },
    notifications: [
      {
        notificationType: {
          type: String,
          enum: ["group_invite", "group_request", "info"],
          required: true,
        },
        status: {
          type: String,
          enum: ['unread', 'read'],
          default: 'unread',
        },
        message: {
          type: String,
          required: true,
        },
        groupId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Group",
        },
        //aka from
        ownerName: {
          type: String,
        },
        //the target of the notification 
        targetId: {
          type: mongoose.Schema.Types.ObjectId,
        }
      },
    ],
    role: {
      type: String,
      enum: ["guest", "refugee", "helper", "admin"],
      default: "guest",
    },
    location: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
