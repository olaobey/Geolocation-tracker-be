import http from 'http';
import app from './src/app';
import dotenv from 'dotenv'
import logger from './src/shared/utils/logger';
import express from 'express';
import { connectDB, disconnectDB } from './src/shared/utils/db';
import config from './config';

dotenv.config()

const server = http.createServer(app);

const startServer = async () => {
  try {
    // connect to database
    await connectDB();

    // listen for requests
    server.listen(config.PORT, () => {
      logger.info(`⚡️[server]: Server running on port at ${config.PORT}`);
    });

    // attach a listener for the 'close' event of the server
    server.on('close', async () => {
      try {
        await disconnectDB();
        logger.info('Database disconnected');
      } catch (error) {
        logger.error('Error disconnecting database:', error);
      }
    });
  } catch (error) {
    logger.error(error);
    setTimeout(connectDB, 5000);
  }
};

startServer()