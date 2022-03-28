import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { COLLECTION, Product } from './dtos/product';

import { ProductBrandService } from './product-brand/product-brand.service';

import {
  Collection,
  Db,
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
} from 'mongodb';

import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductDepartmentService } from './product-department/product-department.service';
import { ProductCategoryService } from './product-category/product-category.service';
import { CreateProductCategoryDto } from './product-category/dtos/create-product-category.dto';
import { ProductStockService } from './product-stock/product-stock.service';
import { KCService } from '../keycloak/keycloak.service';
import { ProductStock } from './product-stock/dtos/product-stock';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

@Injectable()
export class ProductService {
  collection: Collection;
  kc: KCService;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
    private brandService: ProductBrandService,
    private departmentService: ProductDepartmentService,
    private categoryService: ProductCategoryService,
    private stockService: ProductStockService,
    private keycloak: KCService,
  ) {
    try {
      this.kc = keycloak;
      this.collection = db.collection(COLLECTION);
      this.collection
        .createIndex({ name: 1 }, { unique: true })
        .then((r) => /*TODO: Log this*/ console.log(r));
    } catch (err: unknown) {
      throw err;
    }
  }

  async create(
    createProductDto: CreateProductDto,
    user: UserRepresentation,
  ): Promise<InsertOneResult<Product>> {
    createProductDto.isActive = false;
    const newProduct = await this.collection.insertOne(createProductDto);
    const newStock = await this.stockService.update(
      newProduct.insertedId.toString(),
      0,
      0,
      user['sub'],
    );
    await this.update(
      newProduct.insertedId.toString(),
      {
        stock: newStock.value as unknown as ProductStock,
      },
      user,
    );

    return newProduct;
  }

  async findAll(): Promise<Product[]> {
    // todo: add parameter to get only actives products [active, ! OUT_OF_STOCK]
    return (await this.collection.find().toArray()) as unknown as Product[];
  }

  async findOne(id: string): Promise<Product> {
    if (!ObjectId.isValid(id)) throw new BadRequestException();

    const response = await this.collection.findOne({
      _id: new ObjectId(id),
    });

    if (!response) throw new NotFoundException();
    return response as unknown as Product;
  }

  // TODO: Find by name

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: UserRepresentation,
  ): Promise<UpdateResult> {
    if (!ObjectId.isValid(id)) throw new BadRequestException();

    // add/override new brand if his don't exist
    if (updateProductDto.brand) {
      const response = await this.brandService.findByName(
        updateProductDto.brand.name,
      );
      if (!response) await this.brandService.create(updateProductDto.brand);
    }

    // add/override new department if his don't exist
    if (updateProductDto.department) {
      const response = await this.departmentService.findByName(
        updateProductDto.department.name,
      );
      if (!response)
        await this.departmentService.create(updateProductDto.department);
    }

    // add new category if his don't exist
    if (updateProductDto.categories) {
      for (const n of updateProductDto.categories) {
        const newC = new CreateProductCategoryDto();
        newC.name = n.name;
        let response;
        try {
          response = await this.categoryService.create(newC);
        } catch (e) {}
        if (response) n._id = response.insertedId.toString();
      }
    }

    if (
      updateProductDto.stockAmount >= 0 &&
      updateProductDto.stockMinimumAlert >= 0
    ) {
      const updatedStock = await this.stockService.update(
        id,
        updateProductDto.stockAmount,
        updateProductDto.stockMinimumAlert,

        user['sub'],
      );
      updateProductDto.stock = updatedStock.value as unknown as ProductStock;
    }

    delete updateProductDto.stockAmount;
    delete updateProductDto.stockMinimumAlert;

    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateProductDto } },
    );
  }

  async updateImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<UpdateResult> {
    if (!ObjectId.isValid(id)) throw new BadRequestException();

    return await this.db
      .collection(COLLECTION)
      .updateOne({ _id: new ObjectId(id) }, { $set: { image: file } });
  }

  async remove(id: string): Promise<DeleteResult> {
    if (!ObjectId.isValid(id)) throw new BadRequestException();
    await this.stockService.remove(id);
    return await this.collection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}
