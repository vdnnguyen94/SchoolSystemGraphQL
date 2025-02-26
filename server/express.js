// Load module dependencies
import express from 'express';
import morgan from 'morgan';
import compress from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import config from '../config/config.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import courseRoutes from './routes/course.routes.js';
// Configure and initialize Express app
export default function configureExpress() {
  const app = express();

  // Logging & Compression
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  // Middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
//   app.use(helmet());
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(compress());

  // Session Configuration (if needed)
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret || 'default_secret',
  }));

  app.use('/', authRoutes);
  app.use('/', studentRoutes);
  app.use('/', courseRoutes);
  // Static Files
  app.use(express.static('./public'));

  return app;
}
