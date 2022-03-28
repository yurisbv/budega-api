import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDepartmentDto } from './dtos/create-product-department.dto';
import { UpdateProductDepartmentDto } from './dtos/update-product-department.dto';
import {
  Collection,
  Db,
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
} from 'mongodb';
import { COLLECTION, ProductDepartment } from './dtos/product-department';

@Injectable()
export class ProductDepartmentService {
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
    createProductDepartmentDto: CreateProductDepartmentDto,
  ): Promise<InsertOneResult<ProductDepartment>> {
    return await this.db
      .collection(COLLECTION)
      .insertOne(createProductDepartmentDto);
  }

  async findAll(): Promise<ProductDepartment[]> {
    return (await this.collection
      .find()
      .toArray()) as unknown as ProductDepartment[];
  }

  async findOne(id: number): Promise<ProductDepartment> {
    if (!ObjectId.isValid(id)) throw new BadRequestException();

    const response = await this.collection.findOne({
      _id: new ObjectId(id),
    });

    if (!response) throw new NotFoundException();
    return response as unknown as ProductDepartment;
  }

  async findByName(nameToFind: string): Promise<ProductDepartment> {
    return (await this.collection
      .find({ name: nameToFind })
      .sort({ name: 1 })
      .next()) as unknown as ProductDepartment;
  }

  async update(
    id: number,
    updateProductDepartmentDto: UpdateProductDepartmentDto,
  ): Promise<UpdateResult> {
    if (!ObjectId.isValid(id)) throw new BadRequestException();

    return await this.db
      .collection(COLLECTION)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateProductDepartmentDto } },
      );
  }

  async remove(id: number): Promise<DeleteResult> {
    // TODO: remove the department from products
    if (!ObjectId.isValid(id)) throw new BadRequestException();
    return await this.collection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}
