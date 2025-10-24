import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const varifyJWT = asyncHandler(async (req, res, next) => {
  try {
const token =
  req.cookies?.accessToken ||
  req.headers["authorization"]?.split(" ")[1];

//console.log("Here is Your Data",token)
      // //console.log("Env",process.env.process.env.ACCESS_TOKEN_SECRET)

    if (!token) {
      throw new ApiErrors(401, "Unauthorised Request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //console.log(decodeToken)
    const user = await User.findById(decodeToken?._id).select(
      "-password -refreshToken"
    );
    
    //console.log(user)

    if (!user) {
      //Todo:discuss about Frontend
      new ApiErrors(401, "Invalid access Token");
    }
    req.user = user;

    //console.log("req",user)
    next();
  } catch (error) {
    throw new ApiErrors(401, error?.message || "Invalid access Token");
  }
});
