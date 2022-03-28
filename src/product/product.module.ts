import { ExecutionContext, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductBrandModule } from './product-brand/product-brand.module';
import { ProductDepartmentModule } from './product-department/product-department.module';
import { ProductStockModule } from './product-stock/product-stock.module';
import { DatabaseModule } from '../database/database.module';
import { ProductBrandService } from './product-brand/product-brand.service';
import { ProductDepartmentService } from './product-department/product-department.service';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductStockService } from './product-stock/product-stock.service';
import { KCService } from '../keycloak/keycloak.service';
import { HttpModule } from '@nestjs/axios';
import { KeycloakAuthModule } from '../keycloak/keycloak.auth.module';

@Module({
  imports: [
    ProductCategoryModule,
    ProductBrandModule,
    ProductDepartmentModule,
    ProductCategoryModule,
    ProductStockModule,
    //base
    DatabaseModule,
    KeycloakAuthModule,
    HttpModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductBrandService,
    ProductDepartmentService,
    ProductCategoryService,
    ProductStockService,
    // base
    KCService,
  ],
})
export class ProductModule {}
