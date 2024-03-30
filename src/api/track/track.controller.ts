/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { CookieOptions, Request, Response, NextFunction } from 'express';
import { findAll, createTrack, updatedTrack, findTrack, deleteTrack} from '../track/track.service';
import { TrackInput, UpdateTrackInput } from '../../shared/schema/track.schema';
import APIError from '../../shared/utils/error';

export const createTrackController = async (req: Request<{}, {}, TrackInput>, res: Response, next: NextFunction) => {
  try {
    const trackData = req.body; // Assuming the track data is sent in the request body
    const newTrack = await createTrack(trackData);
    if (newTrack) {
      return res.status(201).json({
        success: true,
        message: 'Track created successfully',
        track: newTrack,
      });
    } else {
      return APIError.serverError('Failed to create track', 500);
    }
  } catch (error) {
    return next(APIError.serverError('Internal server error', 500));
  }
};

export const mapHistory = async (req: Request<{}, {}, TrackInput>, res: Response, next: NextFunction) => {
  try {
    const { searchQuery, page, perPage } = req.query;

    const { data, itemCount, pageCount, currentPage } = await findAll({
      searchQuery: searchQuery as string,
      page: parseInt(page as string, 10),
      perPage: parseInt(perPage as string, 10),
    });

    return res.status(200).json({
      data,
      success: true,
      paging: {
        total: itemCount,
        page: currentPage,
        pages: pageCount,
      },
    });
  } catch (error) {
    return next(APIError.serverError('Internal server error', 500));
  }
};

export const updateLocation = async (
  req: Request<{ id: string }, {}, UpdateTrackInput>,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const updatedLocation = req.body;
  try {
    const updatedTrackResult = await updatedTrack(id, updatedLocation);
    if (!updatedTrackResult) {
      return next(APIError.notFound('Could not find such location', 404));
    }

    return res.status(200).json({
      message: 'Track updated successfully',
      success: true,
    });
  } catch (error) {
    return next(APIError.serverError('Internal server error', 500));
  }
};

export const deleteLocation = async (
  req: Request<{ id: string }, {}>,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {

    const existingTrack = await findTrack(id);
    if (!existingTrack) {
      return next(APIError.notFound('Could not find such location', 404));
    }
    await deleteTrack(existingTrack._id);

    return res.status(200).json({
      message: `Track deleted successfully`,
      success: true,
    });
  } catch(error) {
    return next(APIError.serverError('Internal server error', 500));
  }
}
