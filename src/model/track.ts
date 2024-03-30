import mongoose, { Schema, Document } from 'mongoose';
import {geocoder} from '../shared/utils/geocoder'
import { IUser } from './user';
import { IPoint } from './point';
import {PointSchema} from '../model/point'

interface ITrack extends Document {
  userId: IUser['_id'];
  name: string;
  address: string;
  website: string
  phone: string
  city: string
  currentLocation: {
    type: string;
    coordinates: [number, number];
    city: string;
    formattedAddress: string;
  };
}

const trackSchema: Schema<ITrack> = new Schema<ITrack>({
  userId: { type: Schema.Types.ObjectId, ref: 'User'},
  name: { type: String, default: '' },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  city: {
    type: String
  },
  website: {
    type: String
},
phone: {
  required: true,
  type: String
},
  currentLocation: {
    type: PointSchema,
    coordinates: { type: [Number], required: false },
    city: { type: String },
    formattedAddress: { type: String },
  },
},
{
  timestamps: true,
});


// Before saving, convert address to geoCode
trackSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  if (loc && loc.length > 0) {
    const { longitude, latitude, city, formattedAddress } = loc[0];

    this.currentLocation = {
      type: 'PointSchema',
      coordinates: [longitude || 0, latitude || 0], // Use a default value (e.g., 0) if longitude or latitude is undefined
      city: city || '', // Use an empty string if city is undefined
      formattedAddress: formattedAddress || '', // Use an empty string if formattedAddress is undefined
    };

    // Set address to an empty string
    this.address = '';
  }
  next();
});

const TrackModel = mongoose.model<ITrack>('Track', trackSchema);

export { ITrack, TrackModel };



















