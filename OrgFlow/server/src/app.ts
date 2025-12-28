import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
import Routes from './routes';
import swaggerDocs from './utils/swagger';
import { env } from './env';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Swagger documentation
  swaggerDocs(app, parseInt(env.PORT || '3000'));

  app.use("/api", Routes);

  app.use(errorHandler);

  return app;
}
