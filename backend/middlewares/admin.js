import jwt from "jsonwebtoken";

/* Pentru admin authorization */
export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user.admin) {
      return res.status(403).send("Unauthorized");
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
