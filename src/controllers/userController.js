import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { passwordRegex, emailValidate } from "../utils/helper.js";
import envConfig from "../config/envConfig.js";
import Auth from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Validate email format
    if (!emailValidate(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate password strength
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must have at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (#?!@$%^&*-)",
      });
    }

    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: `User with email ${email} already exists`,
      });
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      fullName,
      email,
      password: hashedPassword,
    };

    const userSaved = await Auth.create(newUser);
    if (userSaved.id) {
      return res.render("login");
    } else {
      return res.status(400).json({
        message: "Something went wrong",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    let user = await Auth.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, fullName: user.fullName },
        envConfig.SECRET,
        {
          expiresIn: "1h",
        }
      );

      return res.render("home", { token });
    } else {
      return res.status(500).json({
        message: "invalid email or password",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get User api
export const getUser = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await Auth.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userData = {
      id: user.id,
      fullName: user.fullName,
    };

    return res.status(200).json({
      message: "User found",
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get All User api
export const getAllUser = async (req, res) => {
  try {
    const users = await Auth.findAll();
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "Users not found",
      });
    }
    const userData = users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
    }));

    return res.status(200).json({
      message: "Users found",
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
