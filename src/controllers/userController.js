import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { passwordRegex, emailValidate } from "../utils/helper.js";
import axios from "axios";
import FormData from "form-data";
import envConfig from "../config/envConfig.js";

const User = db.User;

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

    const existingUser = await User.findOne({ where: { email } });
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

    const userSaved = await User.create(newUser);
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

    let user = await User.findOne({ where: { email } });

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
    }

    // const formData = new FormData();
    // formData.append("email", email);
    // formData.append("password", password);
    // const fetchUrl = "http://192.168.1.120:8002/api/login";
    // const response = await axios.post(fetchUrl, formData, {
    //   timeout: 2000,
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // });

    // if (response.status === 200 && response.data.token) {
    //   return res.status(200).json({
    //     message: "External login successful",
    //     userData: response.data.token,
    //   });
    // } else if (
    //   response.status === 401 &&
    //   response.data.error === "Please fill correct email address..!!"
    // ) {
    //   return res.status(401).json({
    //     message: response.data.error,
    //   });
    // }
    else {
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

    const user = await User.findOne({ where: { id } });
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
    const users = await User.findAll();
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
