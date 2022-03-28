import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { KCService } from '../keycloak/keycloak.service';
import { DatabaseModule } from '../database/database.module';
import { ProductStockModule } from '../product/product-stock/product-stock.module';
import { ProductStockService } from '../product/product-stock/product-stock.service';
import { KeycloakAuthModule } from '../keycloak/keycloak.auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ProductStockModule,
    //base
    DatabaseModule,
    KeycloakAuthModule,
    HttpModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ProductStockService,
    //base
    KCService,
  ],
})
export class OrdersModule {}
