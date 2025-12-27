import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
import Routes from './routes';
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  


  app.use("/api", Routes);

  app.use(errorHandler);

  return app;
}

