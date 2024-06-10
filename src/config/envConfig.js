import * as dotenv from "dotenv";
dotenv.config();

const envConfig = {
  DBUser: process.env.DBUser,
  DBPass: process.env.DBPass,
  PORT: parseInt(process.env.PORT),
  SECRET: process.env.SECRET,
};

export default envConfig;
