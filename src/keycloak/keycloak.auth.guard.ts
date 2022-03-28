import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Request } from 'express';
import { KeycloakAuthService } from './keycloak.auth.service';
import { Reflector } from '@nestjs/core';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import { Roles } from '@keycloak/keycloak-admin-client/lib/resources/roles';

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  constructor(
    private readonly authenticationService: KeycloakAuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const header = request.header('Authorization');
    if (!header) {
      throw new HttpException(
        'Authorization: Bearer <token> header missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new HttpException(
        'Authorization: Bearer <token> header invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = parts[1];

    try {
      // Store the user on the request object if we want to retrieve it from the controllers
      const usr = await this.authenticationService.authenticate(token);
      request['user'] = usr;
      const usrRole = await this.hasRole(usr['sub'], roles);
      request['userRole'] = usrRole;
      return !!usrRole.name;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }

  async hasRole(userId: string, roles: string[]): Promise<RoleRepresentation> {
    if (!roles.length) return {};
    const userRoles: RoleRepresentation[] =
      await this.authenticationService.getUserRoles(userId);
    for (let r of userRoles) if (roles.toString().includes(r.name)) return r;

    return {};
  }
}
