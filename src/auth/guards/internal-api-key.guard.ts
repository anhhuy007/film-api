import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { Observable } from "rxjs";

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        const validApiKey = this.configService.get<string>('INTERNAL_API_KEY');

        if (apiKey === validApiKey) {
            return true;
        }

        throw new UnauthorizedException('Invalid or missing API Key for internal services')
    }
}