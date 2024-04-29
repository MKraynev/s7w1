import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtServiceUserAccessTokenLoad } from '../entities/JwtServiceAccessTokenLoad';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/settings';

export enum TokenExpectation {
  Expected,
  Possibly,
}

export const ReadAccessToken = createParamDecorator(
  async (
    data: TokenExpectation = TokenExpectation.Expected,
    ctx: ExecutionContext,
  ): Promise<JwtServiceUserAccessTokenLoad | undefined> => {
    let req = ctx.switchToHttp().getRequest() as Request & {
      user: JwtServiceUserAccessTokenLoad;
    };
    let tokenLoad: JwtServiceUserAccessTokenLoad | undefined = undefined;

    switch (data) {
      case TokenExpectation.Expected:
        tokenLoad = req.user as JwtServiceUserAccessTokenLoad;
        break;

      case TokenExpectation.Possibly:
        let headerAuthString = req.header('authorization');

        if (
          !headerAuthString ||
          !headerAuthString.toLowerCase().startsWith('bearer ')
        )
          return undefined;

        let tokenValue = headerAuthString.split(' ')[1];

        if (tokenValue) {
          try {
            tokenLoad = (await new JwtService({
              secret: JWT_SECRET,
            }).verifyAsync(tokenValue)) as JwtServiceUserAccessTokenLoad;
          } catch (e) {}
        }
        break;
    }
    return tokenLoad;
  },
);
