import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */

export const register = async (req, res) => {
  try {
    const { name, email, password, telefon, picturePath, location, group } =
      req.body;

    //encryption for passw
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      phone,
      picturePath,
      location,
      group,
    });
    const savedUser = await newUser.save();

    //send user 201 status (da, scriu comentariile in engleza :o, da, eu le
    //scriu)
    res.status(201).json(savedUser);
  } catch (err) {
    //sned user 500 if error
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING USER */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (err) {
    //send user 500 if error
    res.status(500).json({ error: err.message });
  }
};
