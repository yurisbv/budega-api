import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Collection,
  Db,
  DeleteResult,
  InsertOneResult,
  ModifyResult,
  ObjectId,
  UpdateResult,
} from 'mongodb';
import { COLLECTION, ProductStock, StockStatus } from './dtos/product-stock';
// import { COLLECTION as HISTORY } from '../product-stock-history/dtos/product-stock-history';

@Injectable()
export class ProductStockService {
  collection: Collection;
  // history: Collection;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {
    try {
      this.collection = db.collection(COLLECTION);
      // this.history = db.collection(HISTORY);
      this.collection
        .createIndex({ productId: 1 }, { unique: true })
        .then((r) => /*TODO: Log this*/ console.log(r));
    } catch (err: unknown) {
      throw err;
    }
  }
  // async create(
  //   productId: string,
  //   amount: number,
  //   minimumAlert: number,
  //   uid: string,
  // ): Promise<InsertOneResult<ProductStock>> {
  //   if (!ObjectId.isValid(productId)) throw new BadRequestException();
  //   // TODO: add to history, need user keycloak ID
  //   return await this.collection.insertOne({
  //     productId,
  //     amount,
  //     minimumAlert,
  //     uid,
  //   });
  // }

  async findByProductId(productId: string): Promise<ProductStock | null> {
    if (!ObjectId.isValid(productId)) throw new BadRequestException();
    return (await this.collection
      .find({ productId: productId })
      .sort({ productId: 1 })
      .next()) as unknown as Promise<ProductStock>;
  }

  // TODO: Check if id is valid
  // TODO: Check if amount is valid
  // TODO: leitura: https://www.cin.ufpe.br/~if695/arquivos/aulas/aulas_NoSQL.pdf
  // TODO: add to history

  // async put(id: string, amount: number): Promise<boolean> {
  //   return await
  // }
  //
  // async remove(id: string, amount: number): Promise<boolean> {
  // }

  async update(
    productId: string,
    amount: number,
    minimumAlert: number,
    uid: string,
  ): Promise<ModifyResult> {
    if (!ObjectId.isValid(productId)) throw new BadRequestException();

    return await this.collection.findOneAndUpdate(
      { productId: productId },
      {
        $set: {
          amount: amount,
          minimumAlert: minimumAlert,
          uid: uid,
          status: this.status(amount, minimumAlert),
        },
      },
      { upsert: true, returnDocument: 'after' },
    );
  }

  async remove(productId: string): Promise<DeleteResult> {
    if (!ObjectId.isValid(productId)) throw new BadRequestException();
    const { _id } = await this.findByProductId(productId);
    if (!ObjectId.isValid(_id)) throw new BadRequestException();
    return await this.collection.deleteOne({
      _id: new ObjectId(_id),
    });
  }

  async getMany(productId: string, amount: number): Promise<boolean> {
    if (!ObjectId.isValid(productId)) throw new BadRequestException();
    let updateResult: UpdateResult;
    const stockItem = (await this.collection.findOne({
      productId,
    })) as unknown as ProductStock;
    if (amount > stockItem.amount)
      throw new BadRequestException(
        new Error('StockItemAmountError'),
        'there is no amount available in stock',
      );
    else {
      updateResult = await this.collection.updateOne(
        { _id: new ObjectId(stockItem._id) },
        {
          $set: {
            amount: stockItem.amount - amount,
            status: this.status(
              stockItem.amount - amount,
              stockItem.minimumAlert,
            ),
          },
        },
      );
    }
    return !!updateResult.modifiedCount;
  }

  async putMany(productId: string, amount: number): Promise<boolean> {
    if (!ObjectId.isValid(productId)) throw new BadRequestException();
    let updateResult: UpdateResult;
    const stockItem = (await this.collection.findOne({
      productId,
    })) as unknown as ProductStock;

    updateResult = await this.collection.updateOne(
      { _id: new ObjectId(stockItem._id) },
      {
        $set: {
          amount: stockItem.amount + amount,
          status: this.status(
            stockItem.amount + amount,
            stockItem.minimumAlert,
          ),
        },
      },
    );
    return !!updateResult.modifiedCount;
  }

  status(amount: number, minimumAlert: number): StockStatus {
    if (amount === 0) return StockStatus.OUT_OF_STOCK;
    else if (amount <= minimumAlert) return StockStatus.RUNNING_LOW;
    else return StockStatus.IN_STOCK;
  }
}
