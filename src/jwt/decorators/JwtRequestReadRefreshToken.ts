import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtServiceUserRefreshTokenLoad } from '../entities/JwtServiceRefreshTokenLoad';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/settings';

export const ReadRefreshToken = createParamDecorator(
  async (
    data: any,
    ctx: ExecutionContext,
  ): Promise<JwtServiceUserRefreshTokenLoad> => {
    let req = ctx.switchToHttp().getRequest() as Request;
    let cookieToken = req.cookies['refreshToken'];

    if (!cookieToken) throw new UnauthorizedException();

    try {
      let decodedObject = (await new JwtService({ secret: JWT_SECRET }).verify(
        cookieToken,
      )) as JwtServiceUserRefreshTokenLoad;

      return decodedObject;
    } catch (e) {
      throw new UnauthorizedException();
    }
  },
);
