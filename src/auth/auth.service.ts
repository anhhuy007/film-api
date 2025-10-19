import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    private users = [
        { id: 1, username: 'admin', password: bcrypt.hashSync('123456', 10)}
    ]

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
        const payload = { username: user.username, sub: user.id };
        return { 
            accessToken: this.jwtService.sign(payload)
        }
    }
}
