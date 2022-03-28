import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { KCService } from '../keycloak/keycloak.service';
import { MulterModule } from '@nestjs/platform-express';
import { KeycloakAuthModule } from '../keycloak/keycloak.auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MulterModule.register({
      dest: process.env.CFG_UPLOAD_PATH,
    }),
    KeycloakAuthModule,
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, KCService],
})
export class UsersModule {}
