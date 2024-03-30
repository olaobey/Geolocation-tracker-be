/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';
import { Point } from 'geojson';
import { socketEvents } from './constants';
import { updatedTrack } from '../../api/notification/favourite.service';
import { TrackModel } from '../../model/track';

import logger from './logger';

interface IUpdatedLocation {
  id: string;
  location: Point;
}

interface ILeaveRoom {
  roomId: string;
}

const socketHandler = (io: Server) => {
  io.on('connection', (socket: any) => {
    logger.info(`⚡: ${socket.id} user just connected`);
    socket.on('disconnect', () => {
      logger.info('A user disconnected');
    });

    // update the location

    socket.on(socketEvents.UPDATE_DA_LOCATION, async (data: IUpdatedLocation) => {
      const { id, location } = data;
      await updatedTrack(id, location);
    });

    // LEAVE_ROOM
    socket.on(socketEvents.LEAVE_ROOM, (data: ILeaveRoom) => {
      socket.leave(data.roomId);
    });
  });

  // MongoDB Change Streams
  const watchOptions = {
    fullDocument: 'updateLookup',
  };

  TrackModel.watch([], watchOptions).on('change', (data: any) => {
    const fullDocument = data.fullDocument;
    io.to(String(fullDocument._id)).emit(socketEvents.DA_LOCATION_CHANGED, fullDocument);
  });
};

export default socketHandler;
