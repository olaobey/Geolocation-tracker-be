import express from 'express';
import { uploadProfileLogo, createAndUpdateProfile, getProfileById } from './profile.controller'
import { updateUserSchema, getProfileByIdSchema, profileLogoSchema } from '../../shared/schema/user.schema'
import { validate } from '../../shared/middleware/validate';
import { ensureAuthenticate } from '../../shared/middleware/authenticate';
import  {upload } from '../../shared/utils/cloudinary'




const router = express.Router();


router.route('/upload/:id').put(ensureAuthenticate, validate(profileLogoSchema), upload.single("file"), uploadProfileLogo);

router.route('/update/:id').put(ensureAuthenticate, validate(updateUserSchema), createAndUpdateProfile);

router.route('/getProfile/:id').get( ensureAuthenticate, validate(getProfileByIdSchema), upload.single("file"), getProfileById);



export default router;