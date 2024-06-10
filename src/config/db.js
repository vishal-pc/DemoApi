import mongoose from "mongoose";
import envConfig from "./envConfig.js";

const db = `mongodb+srv://${envConfig.DBUser}:${envConfig.DBPass}@cartapp.inzne6y.mongodb.net/?retryWrites=true&w=majority&appName=CartApp`;

const dbConnection = mongoose.connect(db);

export default dbConnection;
