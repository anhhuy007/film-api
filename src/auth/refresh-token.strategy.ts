import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh', 
) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super(<StrategyOptionsWithRequest>{
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const authHeader = req.get('authorization');
    if (!authHeader) {
      throw new UnauthorizedException('No refresh token found');
    }

    const refreshToken = authHeader.replace(/^[Bb]earer\s+/i, '').trim();

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    // Use our new AuthService method to validate the token against the DB
    const user = await this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.sub,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    // Attach user to request
    return {
      userId: user.id,
      username: user.username,
      roles: user.roles,
    };
  }
}