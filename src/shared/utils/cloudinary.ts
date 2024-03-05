/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import cloudinary from "cloudinary";



// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });


  const uploadImage = (file: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log(file);
      cloudinary.v2.uploader.upload(
        file,
        { overwrite: true },
        (error: any, result: any) => {
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject({ message: error ? error.message : 'Unknown error' });
          }
        }
      );
    });
  };
  
  const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
      // Extract the file extension from the original filename
      const fileExt = path.extname(file.originalname);
      const uniqueFilename = `${Date.now()}${fileExt}`;
  
      callback(null, uniqueFilename);
    },
  });
  
  export const upload = multer({storage})
  
  export default uploadImage;