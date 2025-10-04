import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    let Connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("Mongo DB Databse Connected :", Connection.connection);
  } catch (error) {
    console.log("Error Found", error);
    process.exit(1);
  }
};
export default connectDB;
