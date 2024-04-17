import * as dotenv from "dotenv";
dotenv.config();

const envConfig = {
  DBName: process.env.DBName,
  DBUser: process.env.DBUser,
  DBPass: process.env.DBPass,
  DBHost: process.env.DBHost,
  DBDialect: process.env.DBDialect,
  DBPort: parseInt(process.env.DBPort),
  PORT: parseInt(process.env.PORT),
  SECRET: process.env.SECRET,
};

export default envConfig;
