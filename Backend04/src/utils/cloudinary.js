import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// console.log(process.env.CLOUDINARY_API_KEY)

const uploadCloudinary = async (localFilePath)=>{
  try {
    if(!localFilePath) return null;
    //Upload File on cloudinary
    let response = await cloudinary.uploader.upload(localFilePath,{
      resource_type:"auto"
    })
    //File has been Uploaded on cloudinary
    console.log("File Uploaded",response.url) 
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath) //remove the locally saved temporary files as 
    //the upload operation got faild.
    return null;
  }
}
export {uploadCloudinary}