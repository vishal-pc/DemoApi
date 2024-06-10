import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import envConfig from "./src/config/envConfig.js";

import userRoutes from "./src/routes/routes.js";
import dbConnection from "./src/config/db.js";

const app = express();
const port = envConfig.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(cors({ origin: "*", methods: "GET, POST, PUT, DELETE" }));

app.use("/", userRoutes);

async function startServer() {
  try {
    app.listen(port, () => {
      console.log("Server is running");
    });

    await dbConnection;
    console.log("Database is connected");
  } catch (error) {
    console.log("Database is not connected");
  }
}
startServer().catch((error) => {
  console.log("Server is not running");
});
