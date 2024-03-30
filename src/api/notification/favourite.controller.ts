// /* eslint-disable @typescript-eslint/ban-types */
// import { CookieOptions, Request, Response, NextFunction } from 'express';
// import { updatedTrack, findTrack } from '../notification/favourite.service'
// import { UpdateTrackInput } from '../../shared/schema/track.schema'
// import APIError from '../../shared/utils/error';
// import { Point } from 'geojson';


// export const updatedLocation = async (req: Request<{id: string}, {}, UpdateTrackInput>, res: Response, next: NextFunction) => {
//     try {
//         const existingTrack = await updatedTrack(req.params.id,
//             {
//                  Point
//               },
//             )
//         if (!existingTrack) {
//             return next(APIError.notFound('Could not find token', 404));
//         }
//         return res.status(200).json({
//             message: 'Track updated successfully',
//             success: true,
//           });
//     } catch(error) {
//         return next(APIError.serverError('Internal server error', 500));
//     }
// }

