import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtServiceUserAccessTokenLoad } from 'src/jwt/entities/JwtServiceAccessTokenLoad';
import { JWT_SECRET } from 'src/settings';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    let tokenLoad: JwtServiceUserAccessTokenLoad = {
      id: payload.id,
      login: payload.login,
    };

    return tokenLoad;
  }
}
