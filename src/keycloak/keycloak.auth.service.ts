import { Injectable } from '@nestjs/common';
import { KCService } from './keycloak.service';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';

export class KeycloakAuthenticationError extends Error {}
export class KeycloakAuthorizationError extends Error {}

@Injectable()
export class KeycloakAuthService {
  constructor(private keycloakService: KCService) {}

  async authenticate(accessToken: string): Promise<UserRepresentation> {
    try {
      return await this.keycloakService.getUserInfo(accessToken);
    } catch (e) {
      throw new KeycloakAuthenticationError(e.message);
    }
  }

  async getUserRoles(userId: string): Promise<RoleRepresentation[]> {
    try {
      return await this.keycloakService.getUserClientRoles(userId);
    } catch (e) {
      throw new KeycloakAuthorizationError(e.message);
    }
  }
}
