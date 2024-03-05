import { NextFunction, Request, Response } from 'express';
import logger from '../../shared/utils/logger';
import APIError from '../../shared/utils/error';

export const notFound = (req: Request, res: Response) => {
  const logMessage = `Route Not Found - URL: ${req.url}, Method: ${req.method}, Query: ${JSON.stringify(
    req.query,
  )}, Params: ${JSON.stringify(req.params)}`;
  logger.error(logMessage);
  res.status(404).json({ msg: 'Route Not Found' });
};

export const generalError = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  logger.error(err);
  // res.status(500).json(err);
  if (err instanceof APIError) {
    res.status(err.status).json({ msg: err.message, success: false, data: err.data });
  } else {
    res.status(500).json({ msg: err.message || 'Unknown Error Occurred', success: false });
  }
};