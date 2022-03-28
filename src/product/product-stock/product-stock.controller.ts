import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductStockService } from './product-stock.service';
import { KeycloakAuthGuard } from '../../keycloak/keycloak.auth.guard';
import { Roles } from '../../keycloak/keycloak.decorator';

@Controller('stocks')
export class ProductStockController {
  constructor(private readonly productStockService: ProductStockService) {}

  @Get()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager', 'budega-app:stockist'])
  findAll() {
    return [];
  }
}
