import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  getAllUser,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/user/getUser", authenticateToken, getUser);
router.get("/user/getUsers", getAllUser);

export default router;
