export const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath); // delete local file after upload
    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};
