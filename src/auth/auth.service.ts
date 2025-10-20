import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { Role } from './enum/role.enum';

@Injectable()
export class AuthService {
    // mock users
    private readonly users = [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('password123', 10),
      roles: [Role.ADMIN],
    },
    {
      id: 2,
      username: 'john',
      password: bcrypt.hashSync('password456', 10),
      roles: [Role.USER],
    },
  ];

    constructor(private jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = this.users.find(u => u.username === username);

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException('Wrong username or password');
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id, roles: user.roles };
        return { 
            accessToken: this.jwtService.sign(payload)
        }
    }
}
