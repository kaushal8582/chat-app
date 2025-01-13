const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({
  path:"./.env"
})

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
})




const uploadOnCloudinary = async(localFilePath)=>{
  try {
    if(!localFilePath) return null;
    console.log(localFilePath);

    const fileExtension = localFilePath.split('.').pop().toLowerCase();
    let resourceType = "auto";

    if (fileExtension === "pdf") {
      resourceType = "raw";
    }
    
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type:resourceType
    })

    console.log("File is uploaded on cloudinary : ",response.url);
    return response;
    
    
  } catch (error) {
    fs.unlinkSync(localFilePath)
    console.log(error.message);
    
    return null
  }
}

module.exports = uploadOnCloudinary;