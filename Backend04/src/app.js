//Ye apana pura server hai yaha par hum express se intract karte hain
//aur aur rought aur decide karte hain by using app.use ka use karete 
//hai request bhejne ke liye

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Handles JSON data (like API requests)
app.use(express.json({ limit: "16kb" }));

// Handles data coming from HTML forms (urlencoded)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serves static files like images, CSS, JS, favicon
app.use(express.static("public"));

// Handles cookies (read and modify them)
app.use(cookieParser());
app.get("/",(req,res)=>{
  res.send("We are Litening")
})


//routes import 
import userRought from './routes/user.routes.js'

//routes decleration
app.use("/api/v1/users",userRought) //yaha se sab user rought par chala jayega 



export { app };
