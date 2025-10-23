import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

let generateAccessAndRefreshTokens = async (userid) => {
  try {
    const user = await User.findById(userid);
    const AccessToken = user.generateAccessToken;
    const RefreshToken = user.generateRefreshToken;

    user.refreshToken = RefreshToken;
    await user.save({ validateBeforeSave: false });

    return { AccessToken, RefreshToken };
  } catch (error) {
    throw new ApiErrors(400, "Somrthing Went Wrong While Generateing Tokens");
  }
};

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
  //  console.log(req.body);

  //2//
  if (
    [fullName, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiErrors(400, "All fields are Required");
  }

  //3//
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiErrors(409, "User Exist {email and username exists}");
  }

  //4//
  // for taking data we use req.body but for file we we req.files
  //and this facility given by multer

  //hamne midlewere ka use user.route.js me kiya hai jiske vajah se
  //jab user ne request kiya usi samay public/temp me hai

  console.log("REQ.FILES ===>", req.files);

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;
  // console.log(avatarLocalPath) it will return public\temp\XYZ.png

  // let coverLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.length > 0
  // ) {
  //   coverLocalPath = req.files.coverImage[0].path
  // }

  // if (!avatarLocalPath) {
  //   throw new ApiErrors(400, "Avatar file is required");
  // }

  //5//
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverLocalPath);

  if (!avatar) {
    throw new ApiErrors(408, "Avatar File is Required");
  }

  //6//
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //7//
  //await User.findById(user._id) yaha hum pta kr rahe hai ki user database me bana ki nahi
  //.select("-password -refreshToken") ab agar user db me successfully ban gya hai to yaha
  //hum password aur refreashtoken ko hide kar ke createdUser me store kar rahe hai
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //8//
  if (!createdUser) {
    throw new ApiErrors(500, "Something went wrong while registering user");
  }

  //9//
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //1// req.body =>data
  //2// username or email
  //3// find the user
  //4// password check
  //5// generate assess and refreash token
  //6// send response and cookies

  //1//
  const { username, email, password } = req.body;

  //2//
  //agar username and email nahi hai to error dega
  //agar username nahi to error dega
  //agar email nahi to error dega
  if (!username || !email) {
    throw new ApiErrors(400, "Username or password is Required");
  }

  //3//
  // User.email({email}) this will check based on email only
  // $or:[username,email]  It can find if any feild match
  let user = await User.findById({
    $or: [username, email],
  });

  if (!user) {
    throw new ApiErrors(404, "User does not Exist!");
  }
  //user ek object hai usi person ka jiska tumne email aur passowrd daala hai
  //user --> you will got {fullName,username ... like usermodel}

  //4//
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw ApiErrors(401, "Invalid Credential (Password Not Matched");
  }

  //5//
  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const LoggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", AccessToken, options)
    .cookie("refreashToken", RefreshToken, options)
    .json(
      new ApiResponse(200, { user: LoggedInUser, AccessToken, RefreshToken },"User Logged in Successfully")
    );
});

let logotUser = asyncHandler(async()=>{
  //Clean Whole Cokkies
  //clear refreash token fron db
  
})

export { registerUser,loginUser  };
