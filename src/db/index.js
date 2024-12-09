import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();

const connectionDB = async () => {
  try {
    const connectionState = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionState.connection.host}`
    );
  } catch (error) {
    console.log("Error while connecting to the DB ", error);
    process.exit(1);
  }
};

export default connectionDB;
