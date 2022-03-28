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
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import { KeycloakAuthGuard } from '../../keycloak/keycloak.auth.guard';
import { Roles } from '../../keycloak/keycloak.decorator';

@Controller('categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager', 'budega-app:stockist'])
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto);
  }

  @Get()
  findAll() {
    return this.productCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService.findOne(id);
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.productCategoryService.findByName(name);
  }

  @Put(':id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager', 'budega-app:stockist'])
  update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(id);
  }
}
