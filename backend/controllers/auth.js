import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //encryption for password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //create new user and save to db
    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();

    //send user 201 status
    res.status(201).json(savedUser);
  } catch (err) {
    //send user 500 if error
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING USER */
// note: IMPLEMENT FINDING USER BY NAME

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find user by email
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    //comparam parola hashuita
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
