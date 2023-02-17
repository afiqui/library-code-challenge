import { HttpExceptionFilter } from './http-exception.filter';
import { ZodError } from 'zod';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let host: ArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const request = {
      url: '/test',
    } as unknown as Request;
    host = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as ArgumentsHost;
  });

  it('should handle HTTP exceptions', async () => {
    // Arrange
    const exception = new HttpException(
      'Test error message',
      HttpStatus.BAD_REQUEST,
    );

    // Act
    await filter.catch(exception, host);

    // Assert
    expect(
      host.switchToHttp().getResponse<Response>().status,
    ).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(
      host.switchToHttp().getResponse<Response>().json,
    ).toHaveBeenCalledWith({
      name: 'HttpException',
      message: 'Test error message',
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle Zod exceptions', async () => {
    // Arrange
    const exception = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['title'],
        message: 'Expected string, received undefined',
      },
    ]);

    // Act
    await filter.catch(exception, host);

    // Assert
    expect(
      host.switchToHttp().getResponse<Response>().status,
    ).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(host.switchToHttp().getResponse<Response>().json).toBeCalledTimes(1);
  });
});
