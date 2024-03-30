/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { CookieOptions, Request, Response, NextFunction } from 'express';
import {
    createUser,
    findUserById,
    findAllUsers,
    findUserAndUpdate,
    findUser,
    deleteUserById,
  } from '../user/user.service';
  import {
    UpdateUserInput,
    GetProfileByIdInput,
    ProfileLogoInput
  } from '../../shared/schema/user.schema';
  import fs from 'fs';
  import APIError from '../../shared/utils/error';
import  uploadImage from '../../shared/utils/cloudinary'



export const createAndUpdateProfile = async(req: Request<{id: string}, {},UpdateUserInput>, res: Response, next: NextFunction) =>{
  const { id } = req.params
  const data = req.body
  try {
    if( id ) {
    const existingUser =  await findUserById(id)
    if(!existingUser){
      return next(APIError.notFound('Could not find such user', 404));
    }

    const updatedData = await findUserAndUpdate(existingUser._id, data) ;
            res.status(200).json({
              success: true,
              message: `User profile with ID ${id} has been updated successfully. Changes applied to: ${Object.keys(
                data,
              )}`,
              data: updatedData,
            });

  } else {
    if (!req.file) {
      return next(APIError.badRequest('No such image provided', 400));
    }
    const image = req.file.path;
    const imageToBase64 = (filePath: string) => {
      // read binary data
      const bitmap = fs.readFileSync(filePath, { encoding: 'base64' });
      return `data:image/jpeg;base64,${bitmap}`;
    };
    const fileData = imageToBase64(image);
    const profileLogo: string = await uploadImage(fileData);
    console.log(profileLogo)
    // Create profile
    await createUser({
      ...data,
      // profileImage: profileLogo.secure_url,
    });
    res.status(201).json({
        success: true,
        message: 'Profile updated successfully',
        data: createUser,
      });
    }
  } catch(error) {
    return next(APIError.serverError('Internal server error', 500));
  }
}

export const uploadProfileLogo = async(req: Request<{id: string}, {}, ProfileLogoInput>, res: Response, next: NextFunction) =>{
  const id = req.params.id
  try {
     // Check if the profile exists
     const userProfile = await findUserById(id);
     if (!userProfile) {
       return next(APIError.notFound(`Could not find such profile with id ${id}`, 404));
     }
     if (!req.file) {
       return next(APIError.badRequest('No such image provided', 400));
     }
     const image = req.file.path;
 
     const imageToBase64 = (filePath: string) => {
       // read binary data
       const bitmap = fs.readFileSync(filePath, { encoding: 'base64' });
       return `data:image/jpeg;base64,${bitmap}`;
     };
     const fileData = imageToBase64(image);
     const profileLogo = await uploadImage(fileData);
     const updatedProfile = {
       ...userProfile,
       profileImage: profileLogo,
     };
    // Update the user's profile image
    await findUserAndUpdate(userProfile._id, updatedProfile);
    return res.status(200).json({
      data: updatedProfile, 
       message: 'Profile picture updated', 
       success: true, 
      });

  } catch(error){
    return next(APIError.serverError('Internal server error', 500));
  }
}

export const getProfileById = async (
  req: Request<{ id: string }, {}, GetProfileByIdInput>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
      // check if the user exist
  const userProfile = await findUserById(id);
  if (!userProfile) {
    return next(APIError.notFound(`Could not find such profile with id ${id}`, 404));
  }
  // Handle successful retrieval
  res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: userProfile,
    });
  } catch (err) {
      return next(APIError.serverError('Internal server error', 500));
  }
}
