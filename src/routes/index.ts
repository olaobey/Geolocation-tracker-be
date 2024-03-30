import express from 'express';
import authRoutes from '../api/auth/auth.routes';
import profileRoutes from '../api/profile/profile.routes'
// import notificationRoutes from '../api/notification/favourite.routes'
import historyRoutes from '../api/track/track.routes'

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/profile', profileRoutes);

// router.use('/location', notificationRoutes);

router.use('/map', historyRoutes);



export default router;