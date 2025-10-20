import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enum/role.enum";
import { ROLES_KEY } from "../decorators/role.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        // If route doens't require any roles, approve access
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.roles) {
            throw new ForbiddenException('You do not have the necessary permission.');
        }

        const hasRole = () => requiredRoles.some((role) => user.roles?.includes(role));
        if (hasRole()) {
            return true;
        }

        throw new ForbiddenException('You do not have the necessary permission.');
    }
}