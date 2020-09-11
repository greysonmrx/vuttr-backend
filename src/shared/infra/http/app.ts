import 'reflect-metadata';
import 'dotenv/config';

import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { errors } from 'celebrate';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import createConnection from '@shared/infra/typeorm';
import AppError from '@shared/errors/AppError';
import swaggerOptions from '@config/swagger';
import routes from './routes';

import '@shared/container';

class App {
  public server: Express;

  constructor() {
    createConnection();
    this.server = express();

    this.middlewares();
    this.routes();
    this.docs();
    this.exceptionHandler();
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(express.json());
  }

  private routes(): void {
    this.server.use(routes);
  }

  public docs(): void {
    const swaggerDocs = swaggerJsDoc(swaggerOptions);

    this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  private exceptionHandler(): void {
    this.server.use(errors());

    this.server.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
      }

      return response.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor.',
      });
    });
  }
}

export default new App().server;
