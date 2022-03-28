import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { DatabaseModule } from '../../database/database.module';
import { KeycloakAuthModule } from '../../keycloak/keycloak.auth.module';
import { HttpModule } from '@nestjs/axios';
import { KCService } from '../../keycloak/keycloak.service';

@Module({
  imports: [DatabaseModule, KeycloakAuthModule, HttpModule],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, KCService],
})
export class ProductCategoryModule {}
