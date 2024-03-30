import mongoose, { Schema, Document } from 'mongoose';


export interface IPoint extends Document {
    type: string;
    coordinates: [number, number];
}

const pointSchema: Schema<IPoint> = new Schema<IPoint>({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
    },
    coordinates: {
        type: [Number], // Defines an array of numbers
        required: true,
        'index': '2dsphere', // set the mongo index : 2d / 2dsphere
    }
},
{
    timestamps: true
});

export const PointSchema = pointSchema;
