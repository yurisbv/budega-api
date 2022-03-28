import { Module } from '@nestjs/common';

import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { KeycloakAuthModule } from './keycloak/keycloak.auth.module';
import { HttpModule } from '@nestjs/axios';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ProductModule,
    UsersModule,
    KeycloakAuthModule,
    HttpModule,
    OrdersModule,
  ],
})
export class AppModule {}

/*
 * TODO: add Logger (Resolve all index create, and log users activity and errors)
 * TODO: Build to prod in docker image
 * TODO: Cart resource
 * TODO: Delivery resource
 * TODO: git secret
 * */
