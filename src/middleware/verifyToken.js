import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  jwt.verify(token, envConfig.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  });
};

export { authenticateToken };
