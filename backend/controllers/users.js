import mongoose from "mongoose";
import User from "../models/User.js";
mongoose.set('debug', true);
/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const ids = req.body;
    console.log(ids)
    const users = await Promise.all(
      ids.map((id) => User.findById(id).select('-password -owns'))
    );
    console.log("users", users);
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name)
    const users = await User.find({ name: new RegExp(name, 'i') })
    users.filter((user) => user.role !== "helper")
    users.save()
    console.log("users", users);
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, name, role, location, picturePath }) => {
        return { _id, name, role, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log("body : ", req.body);
    const { name, email, phone, location } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (location) updateFields.location = location;

    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      updateFields
    );
    res.status(200).json({ message: "setarile au fost schimbare cu succes" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
