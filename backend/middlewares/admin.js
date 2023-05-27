import jwt from "jsonwebtoken";

/* Pentru admin authorization */
export const verifyAdmin = async (req, res, next) => {
  try {
    if (req.user.role == "admin") next();
    else {
      res.status(401).json({
        error: "Access denied",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
