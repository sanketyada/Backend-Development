import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    //1// get user detail from frontend
    //2// validation-not empty
    //3// check if user already exits username email
    //4// check for image  check for avatar
    //5// upload them on Cloudinary,avater
    //6// create user object-create entry in DB
    //7// remove password and refreash token feild from response
    //8// Check for user creation
    //9// return res

  
  let { fullName, email, username, password } = req.body;
   console.log(fullName, email, username, password );


  //2//
  if (
    [fullName, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiErrors(400, "All fields are Required");
  }

  //3//
  const existedUser = await User.findOne({
    $or:[{username},{email}]
  })
  if(existedUser){
    throw new ApiErrors(409,"User Exist {email and username exists}")
  }
   

  //4//
  // for taking data we use req.body but for file we we req.files 
  //and this facility given by multer

  //hamne midlewere ka use user.route.js me kiya hai jiske vajah se 
  //jab user ne request kiya usi samay public/temp me hai
  // console.log("REQ.FILES ===>", req.files);

const avatarLocalPath = req.files?.avatar?.[0]?.path;
const coverLocalPath = req.files?.coverImage?.[0]?.path;


  if(!avatarLocalPath){
    throw new ApiErrors(400,"Avatar file is required")
  }
  
 //5//
  const avatar = await uploadCloudinary(avatarLocalPath)
  const coverImage = await uploadCloudinary(coverLocalPath)
  
  if(!avatar){
    throw new ApiErrors(408,"Avatar File is Required")
  }
  

  //6//
  const user  = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url ||"",
    email,
    password,
    username:username.toLowerCase()
  })
  
  //7//
  //await User.findById(user._id) yaha hum pta kr rahe hai ki user database me bana ki nahi
  //.select("-password -refreshToken") ab agar user db me successfully ban gya hai to yaha 
  //hum password aur refreashtoken ko hide kar ke createdUser me store kar rahe hai
  const createdUser = await User.findById(user._id).select(
     "-password -refreshToken"
  )

  //8//
  if(!createdUser){
    throw new ApiErrors(500,"Something went wrong while registering user")
  }
 
  //9//
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
  )

});

export { registerUser };


// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiErrors } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";
// import { uploadCloudinary } from "../utils/cloudinary.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// const registerUser = asyncHandler(async (req, res) => {
//   const { fullName, email, username, password } = req.body;

//   if ([fullName, email, username, password].some((field) => field.trim() === "")) {
//     throw new ApiErrors(400, "All fields are required");
//   }

//   const existedUser = await User.findOne({ $or: [{ username }, { email }] });
//   if (existedUser) {
//     throw new ApiErrors(409, "User exists (email or username already in use)");
//   }

//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   const coverLocalPath = req.files?.coverImage?.[0]?.path;

//   if (!avatarLocalPath) {
//     throw new ApiErrors(400, "Avatar file is required");
//   }

//   const avatar = await uploadCloudinary(avatarLocalPath);
//   const coverImage = await uploadCloudinary(coverLocalPath);

//   if (!avatar) {
//     throw new ApiErrors(400, "Avatar file upload failed");
//   }

//   const user = await User.create({
//     fullName,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || "",
//     email,
//     password,
//     username: username.toLowerCase(),
//   });

//   const createdUser = await User.findById(user._id).select("-password -refreshToken");

//   if (!createdUser) {
//     throw new ApiErrors(500, "Something went wrong while registering user");
//   }

//   return res.status(201).json(
//     new ApiResponse(201, createdUser, "User registered successfully")
//   );
// });

// export { registerUser };
