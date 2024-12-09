import express from "express";
import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";
const app = express();
import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});
import connectionDB from "./db/index.js";

// FIRST APPROACH
/* // new concept ifi'ss ()()

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (errors) => {
      console.log("Errrr ", errors);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log("Connected to the port.");
    });
  } catch (error) {
    console.log("Error while connecting with DB", error);
  }
})();
 */

// second approach
connectionDB();
