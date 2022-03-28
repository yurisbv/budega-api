import { Module } from '@nestjs/common';
import { KeycloakAuthGuard } from './keycloak.auth.guard';
import { KeycloakAuthService } from './keycloak.auth.service';
import { KCService } from './keycloak.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [KeycloakAuthGuard, KeycloakAuthService, KCService],
  exports: [KeycloakAuthService],
})
export class KeycloakAuthModule {}
