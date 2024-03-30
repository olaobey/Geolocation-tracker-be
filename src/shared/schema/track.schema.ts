import { updatedTrack } from './../../api/notification/favourite.service';
import { number, object, string, TypeOf, z } from 'zod';


export const trackSchema = object({
    body: object({
      name: string({ required_error: 'Name is required' }),
      address: string({ required_error: 'Address is required' }),
      city: string({ required_error: 'Address is required' })
    }),
  });

  export const updateTrackSchema = object({
    params: object({
      id: string(),
    })
  })


export type TrackInput = TypeOf<typeof trackSchema>['body'];
export type UpdateTrackInput = TypeOf<typeof updateTrackSchema>['params']
