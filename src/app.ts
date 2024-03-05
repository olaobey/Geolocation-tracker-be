import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import logger from '../src/shared/utils/logger';
import morganLogger from './shared/middleware/morgan.logger';
import { generalError } from '../src/shared/middleware/error.middleware';
import { CORS_WHITELISTS } from '../config/index';
import flash from 'express-flash';
import hpp from 'hpp';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import Router from '../src/routes/index';
import { getEnvVariable } from './shared/utils/env';


dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, cb) => {
      logger.info(JSON.stringify({ origin, whitelists: CORS_WHITELISTS }), 'Cors Info');
      return cb(null, true);
    },
    credentials: true,
  }),
);

// Session middleware set up
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
      cookie: {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    store: MongoStore.create({
    mongoUrl: getEnvVariable('DB_URI'),
    dbName: getEnvVariable('DATABASE_NAME'),
    stringify: false,
    autoRemove: 'interval',
    autoRemoveInterval: 1 // In minutes
    }),
  })
);


// Secure HTTP headers setting middleware
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

app.use(helmet());

app.set('view engine', 'ejs');

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(morganLogger());

// middleware to handle an incoming request and also Support json encoded bodies
app.use(
  express.json({
    limit: '150mb',
    type: ['application/x-www-form-urlencoded', 'application/json'],
  })
); 

app.use(flash());

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', Router);

// send back a 404 error for any unknown api request
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' });
    } else {
      res.type('txt').send('404 Not Found');
    }
  });

app.use(generalError);

export default app;