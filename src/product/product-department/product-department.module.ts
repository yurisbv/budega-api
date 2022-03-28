import { Module } from '@nestjs/common';
import { ProductDepartmentService } from './product-department.service';
import { ProductDepartmentController } from './product-department.controller';
import { DatabaseModule } from '../../database/database.module';
import { KeycloakAuthModule } from '../../keycloak/keycloak.auth.module';
import { HttpModule } from '@nestjs/axios';
import { KCService } from '../../keycloak/keycloak.service';

@Module({
  imports: [DatabaseModule, KeycloakAuthModule, HttpModule],
  controllers: [ProductDepartmentController],
  providers: [ProductDepartmentService, KCService],
})
export class ProductDepartmentModule {}
