import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductBrandService } from './product-brand.service';
import { CreateProductBrandDto } from './dtos/create-product-brand.dto';
import { UpdateProductBrandDto } from './dtos/update-product-brand.dto';
import { KeycloakAuthGuard } from '../../keycloak/keycloak.auth.guard';
import { Roles } from '../../keycloak/keycloak.decorator';

@Controller('brands')
export class ProductBrandController {
  constructor(private readonly productBrandService: ProductBrandService) {}

  @Post()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager', 'budega-app:stockist'])
  create(@Body() createProductBrandDto: CreateProductBrandDto) {
    return this.productBrandService.create(createProductBrandDto);
  }

  @Get()
  findAll() {
    return this.productBrandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productBrandService.findOne(id);
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.productBrandService.findByName(name);
  }

  @Put(':id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager', 'budega-app:stockist'])
  update(
    @Param('id') id: string,
    @Body() updateProductBrandDto: UpdateProductBrandDto,
  ) {
    return this.productBrandService.update(id, updateProductBrandDto);
  }

  @Delete(':id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  remove(@Param('id') id: string) {
    return this.productBrandService.remove(id);
  }
}
