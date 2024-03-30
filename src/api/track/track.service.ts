/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, QueryOptions, Query } from 'mongoose';
import { Point } from 'geojson';
import {TrackModel, ITrack } from '../../model/track'



export const createTrack = async (trackData: Partial<ITrack>): Promise<ITrack | null> => {
  try {
    const newTrack = await TrackModel.create(trackData);
    return newTrack;
  } catch (error) {
    console.error('Error creating track:', error);
    return null;
  }
};


// Find all tracks  by
export const findAll = async (
  query: { searchQuery?: string; page?: number; perPage?: number },
): Promise<{ data: ITrack[]; itemCount: number; pageCount: number; currentPage: number }> => {
  const perPage = query.perPage || 10; // Default to 10 items per page
  const page = query.page || 1; // Default to the first page
  const offset = (page - 1) * perPage;
  const searchQuery = query.searchQuery || '';

  const filters: any = {};

  if (searchQuery) {
    const search = new RegExp(searchQuery, 'i'); // Create case-insensitive regex
    filters.$or = [
      { name: { $regex: search, $options: 'i' } }, // Search by name (case-insensitive)
      { address: { $regex: search, $options: 'i' } }, // Search by address (case-insensitive)
    ];
  }

  const [data, itemCount] = await Promise.all([
    TrackModel.find(filters)
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(offset)
      .lean(),
    TrackModel.countDocuments(filters),
  ]);

  const pageCount = Math.ceil(itemCount / perPage);
  const currentPage = page;

  return { data, itemCount, pageCount, currentPage };
};

export const updatedTrack = async(
  id: string,
  data: Partial<ITrack>
 ): Promise<ITrack | null> => {
     const updatedTrack = await TrackModel.findByIdAndUpdate(
         id,
         data,
         { new: true }
       );
       if (!updatedTrack) {
         throw new Error('Track not found');
       }
   
       return updatedTrack;
 }

// Find User by Id
export const findTrack = async (id: string): Promise<ITrack | null> => {
  const existingTrack = await TrackModel.findById(id)
  return existingTrack;
};

export const deleteTrack = async (id: string): Promise<ITrack | null> => {
  const existingTrack = await TrackModel.findByIdAndDelete(id)
  return existingTrack;
};

