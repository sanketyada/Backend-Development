import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Subscriber } from "../models/subscriber.model.js";
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found while generating tokens");
    }

    //console.log("Found user:", user.username) // check if user exists

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //console.log("AccessToken:", accessToken)
    //console.log("RefreshToken:", refreshToken)

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateAccessAndRefereshTokens:", error);
    throw new ApiErrors(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

//Controller
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

  // console.log("REQ.FILES ===>", req.files);

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
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, username, password } = req.body;
  // console.log(email);

  if (!username && !email) {
    throw new ApiErrors(400, "username or email is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiErrors(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiErrors(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //Clean Whole Cokkies
  //clear refreash token fron db

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out!"));
});

const refreshAccessTokne = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiErrors(401, "Unauthorised REquest");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiErrors(401, "Invalid refreashToken");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiErrors(401, "Refreash Token is Expired or Used.");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "Access Token refresh"
        )
      );
  } catch (error) {
    throw new ApiErrors(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  let user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiErrors(400, "OldPassword is Invalid");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user?._id)
  // console.log(user)
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fatched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  console.log(fullName, email);
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Details Updated Successfully"));
});

const updateUserAvater = asyncHandler(async (req, res) => {
  const avaterLoacalPath = req.file?.path;

  if (!avaterLoacalPath) {
    throw new ApiErrors("avaterLoacalPath is Not available");
  }

  const avaterCloudnary = await uploadCloudinary(avaterLoacalPath);
  if (!avaterCloudnary) {
    throw new ApiErrors("Error while Uploading on Cloudnary");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avaterCloudnary.url,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Updated Successfully"));
  console.log(req.user);
});
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const CoverImageLoacalPath = req.file?.path;

  if (!CoverImageLoacalPath) {
    throw new ApiErrors("CoverImageLoacalPath is Not available");
  }

  const coverImageCloudnary = await uploadCloudinary(CoverImageLoacalPath);
  if (!coverImageCloudnary) {
    throw new ApiErrors("Error while Uploading on Cloudnary");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImageCloudnary.url,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "CoverImage Updated Successfully"));
  console.log(req.user);
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiErrors(400, "Username is Missing.");
  }

  const channel = await User.aggregate([
    //Here we find the user from database
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscribers", //Subscriber conveted to subscribers for mo0ngodb
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscribers", //Subscriber conveted to subscribersfor mongodb
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          if: {
            $in: [req.user?._id, "$subscribers.subscriber"],
          },
          then: true,
          else: false,
        },
        // isSubscribed: {
        //   $cond: {
        //     if: { $in: [req.user?._id, "$subscribers.subscriber"] },
        //     then: true,
        //     else: false,
        //   },
        // },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiErrors(404, "Channel does Not Exist!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User Channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline:[
          {
            $lookup: {
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullName:1,
                    username:1,
                    avatar:1,
                  }
                }
              ]
            },
          },
          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ],
      },
    },
    {},
  ]);

  return res
  .status(200)
  .json(
    new ApiResponse(200,user[0].watchHistory,"WatchHistory Fetched successfully")
  )
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessTokne,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvater,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
//Note:accessToken and refreshToken are mostly used for validation or verification
//so that the user not need to give email password for every time
//accesstOken => ShortLived ,we not save it in Db
//refreashToken(sessionstoreg) => longLived,we savedit in DB

//So WhenEver accessToken get Expired afterTimeup
//user get 401 access uauthorised
//so instead login fronted will send refershtoken
//if it match with refreshToken in DB
//then Here a NEw access Token Will generate for shortTime
