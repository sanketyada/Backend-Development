import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "./constants.js";
import dotenv from "dotenv";
dotenv.config();
const Port = process.env.PORT;
const app = express();
import connectDB from "./db/index.js";

// connectDB();

// ////DataBase Connection
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error", error);
//       throw error;
//     });

//     app.get("/", (req, res) => {
//       res.send("Here We Go");
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App is Litening at ${Port}`);
//     });

//   } catch (error) {
//     console.log("Error Found", error);
//     throw error;
//   }
// })();
