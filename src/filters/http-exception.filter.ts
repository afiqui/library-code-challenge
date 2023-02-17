import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ZodError } from 'zod';
import { Request, Response } from 'express';

// @Catch(HttpException)
// @Catch(ZodError)
@Catch()
export class HttpExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  async catch(exception: any, host: ArgumentsHost): Promise<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (exception instanceof ZodError) {
      response.status(400).json({
        statusCode: 400,
        message: exception.message,
        name: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      const status = exception.getStatus();
      response.status(status).json({
        name: exception.name,
        message: exception.message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
