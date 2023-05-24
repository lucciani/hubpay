import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    let message: any;
    let status: number;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = `Ocorreu um erro interno inesperado no sistema.`;
    }

    if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
      const err = JSON.parse(JSON.stringify(exception.getResponse()));
      const restr = JSON.parse(JSON.stringify(err.message)).map(
        (restr) => restr.constraints,
      );

      response.status(status).json({
        status,
        message,
        error: restr === undefined ? err.message : restr,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else if (status === HttpStatus.UNAUTHORIZED) {
      const err = JSON.parse(JSON.stringify(exception.getResponse()));

      response.status(status).json({
        status,
        message,
        error: err === undefined ? null : err.error,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      const err = JSON.parse(JSON.stringify(exception.getResponse()));
      response.status(status).json({
        status,
        message,
        error: err.cause === undefined ? null : err.cause,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
