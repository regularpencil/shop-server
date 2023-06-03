import {PassportStrategy} from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import {ConfigService} from '@nestjs/config';
import { Request } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET
        })
    }

    async validate(payload) {
        return {email: payload.email}
    }

    private static extractJWT(req: Request): string | null {
        console.log(req.cookies);
        if (
          req.cookies &&
          'accessToken' in req.cookies &&
          req.cookies.accessToken.length > 0
        ) {
          return req.cookies.accessToken;
        }
        return null;
      }
} 