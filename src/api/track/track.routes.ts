import express from 'express';
import {createTrackController, mapHistory, updateLocation, deleteLocation } from './track.controller'
import { validate } from '../../shared/middleware/validate';
import { trackSchema, updateTrackSchema } from '../../shared/schema/track.schema'
import { ensureAuthenticate } from '../../shared/middleware/authenticate';



const router = express.Router();


router.route('/create').post( ensureAuthenticate, validate(trackSchema), createTrackController);


router.route('/update/:id').put( ensureAuthenticate, validate(updateTrackSchema), updateLocation);


router.route('/getHistory').get(ensureAuthenticate, mapHistory );


router.route('/delete/:id').delete(ensureAuthenticate, deleteLocation);


export default router;