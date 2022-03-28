import { Module } from '@nestjs/common';
import { ProductBrandService } from './product-brand.service';
import { ProductBrandController } from './product-brand.controller';
import { DatabaseModule } from '../../database/database.module';
import { KeycloakAuthModule } from '../../keycloak/keycloak.auth.module';
import { KCService } from '../../keycloak/keycloak.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, KeycloakAuthModule, HttpModule],
  controllers: [ProductBrandController],
  providers: [ProductBrandService, KCService],
})
export class ProductBrandModule {}
