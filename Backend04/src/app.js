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

//routes import 
import userRought from './routes/user.routes.js'


//routes decleration
app.use("/api/v1/users",userRought)
// app.get("/api",(req,res)=>{
//   res.send("suitening")
// })


export { app };
