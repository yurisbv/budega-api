import { Module } from '@nestjs/common';
import { ProductStockService } from './product-stock.service';
import { ProductStockController } from './product-stock.controller';
import { DatabaseModule } from '../../database/database.module';
import { KCService } from '../../keycloak/keycloak.service';
import { KeycloakAuthModule } from '../../keycloak/keycloak.auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, KeycloakAuthModule, HttpModule],
  controllers: [ProductStockController],
  providers: [ProductStockService, KCService],
})
export class ProductStockModule {}
