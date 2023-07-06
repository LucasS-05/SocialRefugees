import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(req.body)

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      role: role,
    });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err)
  }
};

/* LOGGING USER */
// note: IMPLEMENT FINDING USER BY NAME

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email });
    let isAdmin = user.role == "admin" ? true : false;
    if (!user) return res.status(400).json({ user: "Utilizatorul nu exista" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ password: "User / parola invalida" });

    const token = jwt.sign({ id: user._id, admin: isAdmin }, process.env.JWT_SECRET);

    user = user.toObject();
    delete user.password

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
