import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException)
export class DataBaseException implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.message;
    //TODO не обрабатывает БД ошибки
    switch (exception.name) {
      case 'NotFoundException':
        response.status(HttpStatus.NOT_FOUND).json({
          errorMessage: 'id doesnt exist',
        });
        break;
      default:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorMessage: 'id doesnt exist',
        });
        break;
    }
  }
}
