import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Headers,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { KeycloakAuthGuard } from '../keycloak/keycloak.auth.guard';
import { Roles } from '../keycloak/keycloak.decorator';
import { KeycloakUserContext } from '../keycloak/utils/user.context';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  async create(
    @Body() createProductDto: CreateProductDto,
    @KeycloakUserContext() user: UserRepresentation,
  ) {
    const resp = await this.productService.create(createProductDto, user);
    return { id: resp.insertedId.toString() };
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(String(id));
  }

  @Put(':id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager', 'budega-app:stockist'])
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @KeycloakUserContext() user: UserRepresentation,
  ) {
    return await this.productService.update(String(id), updateProductDto, user);
  }

  @Put('image/:id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager', 'budega-app:stockist'])
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    // TODO: read this http://www.nestjstutorials.com/nestjs-file-uploading-using-multer/
    // TODO: save image in folder inside top root folder and
    // TODO: save image url link into user atributes name avatar
    return await this.productService.updateImage(String(id), image);
  }

  @Delete(':id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager', 'budega-app:stockist'])
  async remove(@Param('id') id: string) {
    return await this.productService.remove(String(id));
  }
}
