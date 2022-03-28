import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Collection,
  Db,
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
} from 'mongodb';
import { COLLECTION, ProductBrand } from './dtos/product-brand';

import { CreateProductBrandDto } from './dtos/create-product-brand.dto';
import { UpdateProductBrandDto } from './dtos/update-product-brand.dto';

@Injectable()
export class ProductBrandService {
  collection: Collection;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {
    try {
      this.collection = db.collection(COLLECTION);
      this.collection
        .createIndex({ name: 1 }, { unique: true })
        .then((r) => /*TODO: Log this*/ console.log(r));
    } catch (err: unknown) {
      throw err;
    }
  }

  async create(
    createProductBrandDto: CreateProductBrandDto,
  ): Promise<InsertOneResult<ProductBrand>> {
    return await this.db
      .collection(COLLECTION)
      .insertOne(createProductBrandDto);
  }

  async findAll(): Promise<ProductBrand[]> {
    return (await this.collection
      .find()
      .toArray()) as unknown as ProductBrand[];
  }

  async findOne(id: string): Promise<ProductBrand> {
    if (!ObjectId.isValid(id)) throw new BadRequestException();

    const response = await this.collection.findOne({
      _id: new ObjectId(id),
    });

    if (!response) throw new NotFoundException();
    return response as unknown as ProductBrand;
  }

  async findByName(nameToFind: string): Promise<ProductBrand> {
    return (await this.collection
      .find({ name: nameToFind })
      .sort({ name: 1 })
      .next()) as unknown as ProductBrand;
  }

  async update(
    id: string,
    updateProductBrandDto: UpdateProductBrandDto,
  ): Promise<UpdateResult> {
    if (!ObjectId.isValid(id)) throw new BadRequestException();
    // TODO: update the brand from products
    return await this.db
      .collection(COLLECTION)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateProductBrandDto } },
      );
  }

  async remove(id: string): Promise<DeleteResult> {
    // TODO: remove the brand from products
    if (!ObjectId.isValid(id)) throw new BadRequestException();
    return await this.collection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}
