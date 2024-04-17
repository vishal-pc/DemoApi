import { Sequelize } from "sequelize";
import UserModel from "../models/userModel.js";
import envConfig from "./envConfig.js";

// For local connections
const sequelize = new Sequelize(
  envConfig.DBName,
  envConfig.DBUser,
  envConfig.DBPass,
  {
    host: envConfig.DBHost,
    dialect: envConfig.DBDialect,
    port: envConfig.DBPort,
    logging: false,
  }
);

// For live connections
// const sequelize = new Sequelize(
//   `postgres://admin:4OQG3qddSVc41DhLbPFqwh9Y6xQo1823@dpg-cofm4nv79t8c73c69hu0-a.singapore-postgres.render.com/radaar_database`,
//   {
//     dialect: "postgres",
//     protocol: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     logging: false,
//   }
// );

try {
  await sequelize.authenticate();
  console.log("Database Connected...👍️");
} catch (error) {
  console.error("Database not connected...🥱", error);
}

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = UserModel(sequelize, Sequelize.DataTypes, Sequelize.Model);
await db.sequelize.sync({ force: false });
export default db;
