/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import { getEnvVariable } from '../../utils/env';
import User from '../../../model/user';
import APIError from '../../utils/error';


const GoogleStrategy = passportGoogle.Strategy;

const GOOGLE_CLIENT_ID = getEnvVariable('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = getEnvVariable('GOOGLE_CLIENT_SECRET');
const GOOGLE_CALLBACK_URL = '/api/auth/google/redirect';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const email = profile['_json']['email'];
        if (!email)
          return done(APIError.notFound('Failed to receive email from Google. Please try again', 404))

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ googleId: profile.id });

        if (req.existingUser) {
          if (
            !req.existingUser.google ||
            (!req.existingUser.google.email &&
              !req.existingUser.google.accessToken &&
              !req.existingUser.google.profileId
              )
          ) {
            /**
             * proceed with provider sync, iff:
             * 1. req.user exists and no google account is currently linked
             * 2. there's no existing account with google login's email
             * 3. google login's email is present in req.user's object for any provider (indicates true ownership)
             */
            if (
              !existingUser ||
              (existingUser && existingUser._id.toString() === req.existingUser._id.toString())
            ) {
              await User.findOneAndUpdate(
                { _id: req.existingUser._id },
                {
                  $set: {
                    'google.email': email,
                    'google.profileId': profile.id,
                    'google.accessToken': accessToken,
                    
                  },
                }
              );
              return done(null, req.existingUser);
            }
            // cannot sync google account, other account with google login's email already exists
          }
          return done(null, req.user);
        } else {
          if (existingUser) {
            // Update the user's profileImage if it exists in the profile
            if (profile.photos && profile.photos.length > 0) {
              existingUser.profileImage = profile.photos[0].value;
              await existingUser.save();
            }
            return done(null, existingUser);
          }
          const newUser = await User.create({
            fullName: profile.displayName,
            email,
            profileImage: profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : null,
            google: {
              accessToken,
              profileId: profile.id,
              email: email
            },
          });
          return done(null, newUser);
        }

      } catch (verifyErr) {
        done( verifyErr );
      }
    },
  ),
);

// Serialize user
passport.serializeUser((existingUser, done) => {
  done(null,existingUser._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const existingUser = await User.findById(id);
    done(null, existingUser);
  } catch (error) {
    done(error);
  }
});

export default passport;