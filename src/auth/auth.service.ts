import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { Role } from './enum/role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private readonly users = [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('password123', 10),
      roles: [Role.ADMIN],
      hashedRefreshToken: null as string | null,
    },
    {
      id: 2,
      username: 'john',
      password: bcrypt.hashSync('password456', 10),
      roles: [Role.USER],
      hashedRefreshToken: null as string | null,
    },
  ];

    constructor(
      private jwtService: JwtService,
      private readonly configService: ConfigService
    ) {}

    private async hashData(data: string): Promise<string> {
      return bcrypt.hash(data, 10);
    }

    private async getTokens(userId: number, username: string, roles: Role[]) {
      const payload = {
        sub: userId,
        username,
        roles,
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_SECRET')! as any,
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN')! as any,
        }),
        this.jwtService.signAsync(
          { sub: userId, username }, 
          {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET')! as any,
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')! as any,
          },
        ),
      ]);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }

    private async updateRefreshToken(userId: number, refreshToken: string | null) {
      const user = this.users.find((u) => u.id === userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (refreshToken) {
        const hash = await this.hashData(refreshToken);
        user.hashedRefreshToken = hash;
      } else {
        user.hashedRefreshToken = null;
      }
    }

    async login(loginDto: { username: string; pass: string }) {
      const user = this.users.find(
        (u) => u.username === loginDto.username,
      );

      console.log(`Logging in user: ${loginDto.username} - ${loginDto.pass}`);

      if (!user || !bcrypt.compareSync(loginDto.pass, user.password)) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate new tokens
      const tokens = await this.getTokens(user.id, user.username, user.roles);

      // Save the new hashed refresh token
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = this.users.find(u => u.username === username);

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException('Wrong username or password');
    }

    async logout(userId: number) {
      // Set the user's hashed refresh token to null
      await this.updateRefreshToken(userId, null);
      return { message: 'Logged out successfully' };
    }

    async refreshTokens(userId: number, rt: string) {
      const user = this.users.find((u) => u.id === userId);
      if (!user || !user.hashedRefreshToken) {
        throw new ForbiddenException('Access Denied');
      }

      // Compare the provided token with the stored hash
      const rtMatches = await bcrypt.compare(rt, user.hashedRefreshToken);
      if (!rtMatches) {
        throw new ForbiddenException('Access Denied');
      }

      const tokens = await this.getTokens(user.id, user.username, user.roles);
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
      const user = this.users.find((u) => u.id === userId);

      if (!user || !user.hashedRefreshToken) {
        return null;
      }

      const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
      if (isMatch) {
        return user;
      }

      return null;
    }
}
