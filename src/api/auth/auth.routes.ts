import express from 'express';
import { signupUser, siginUser, emailVerification, forgotPassword, resendMail, resetPassword } from './auth.controller'
import { signupUserSchema, signinUserSchema, verifyEmailSchema, resendMailSchema, forgotPasswordSchema, resetPasswordSchema } from '../../shared/schema/user.schema'
import { validate } from '../../shared/middleware/validate';
import passportGoogleOauth2 from '../../shared/services/social-oauth2/google-oauth2'


const router = express.Router();


router.route('/signup').post(validate(signupUserSchema), signupUser);

router.route('/signin').post(validate(signinUserSchema), siginUser);

router.route('/verifyEmail/:token').get(validate(verifyEmailSchema), emailVerification);

router.route('/resendMail').post(validate(resendMailSchema), resendMail);

router.route('/forgot').post(validate(forgotPasswordSchema), forgotPassword);

router.route('/reset/:token').patch(validate(resetPasswordSchema), resetPassword);

router.route('/auth/google').get(passportGoogleOauth2.authenticate('google', {
  scope: ["email", "profile"],
}))

router.route('/google/redirect').get(passportGoogleOauth2.authenticate('google', {
  failureRedirect: "/",
  successRedirect: "/profile",
  failureFlash: true,
  successFlash: "Successfully logged in!",
})
)


export default router;