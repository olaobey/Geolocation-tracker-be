import { Point } from 'geojson';
import {ITrack, TrackModel} from '../../model/track'



// Find track by Id
export const findTrack = async (id: string) => {
    const track = await TrackModel.findById(id).lean();
    return track;
  };

  export const updatedTrack = async(
     id: string,
    location: Point
    ): Promise<ITrack | null> => {
        const updatedTrack = await TrackModel.findByIdAndUpdate(
            id,
            {
              currentLocation: location,
            },
            { new: true }
          );
          if (!updatedTrack) {
            throw new Error('Track not found');
          }
      
          return updatedTrack;
    }