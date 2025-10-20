import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PartnerApiKeyGuard implements CanActivate {
    private readonly clients: Map<string, string>;

    constructor(private readonly configService: ConfigService) {
        const clientJson = this.configService.get<string>('CLIENTS_API_KEYS', '{}');
        this.clients = new Map(Object.entries(JSON.parse(clientJson)));
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        if (!apiKey) throw new UnauthorizedException('API Key is missing');

        const clientName = this.getClientNameByApiKey(apiKey);
        if (clientName) {
            request.client = { name: clientName };
            return true;
        }

        throw new UnauthorizedException('Invalid API Key for partner');
    }

    private getClientNameByApiKey(apiKey: string): string | undefined {
        for (const [key, name] of this.clients.entries()) {
            if (key === apiKey) {
                return name;
            }
        }

        return undefined;
    }
}