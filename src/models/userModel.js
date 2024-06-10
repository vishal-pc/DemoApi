import mongoose, { Schema } from "mongoose";

const authSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const Auth = mongoose.model("User", authSchema);
export default Auth;
