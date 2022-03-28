import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Collection, Db, ObjectId } from 'mongodb';
import { KCService } from '../keycloak/keycloak.service';
import { CartItem, COLLECTION, Order, ORDER_STATE } from './dto/orders';
import { ProductStockService } from '../product/product-stock/product-stock.service';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';

@Injectable()
export class OrdersService {
  collection: Collection;
  kc: KCService;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
    private keycloak: KCService,
    private stockService: ProductStockService,
  ) {
    {
      try {
        this.kc = keycloak;
        this.collection = db.collection(COLLECTION);
        // this.collection
        //   .createIndex({ name: 1 }, { unique: true })
        //   .then((r) => /*TODO: Log this*/ console.log(r));
      } catch (err: unknown) {
        throw err;
      }
    }
  }

  async create(createOrderDto: CreateOrderDto, user: UserRepresentation) {
    let newOrder = new Order();
    newOrder.itemsList = createOrderDto.itemsList;
    newOrder.orderAddress = createOrderDto.orderAddress;
    newOrder.paymentMode = createOrderDto.paymentMode || 'MONEY';
    newOrder.userId = user['sub'];
    newOrder.state = 'ORDER';
    const now = new Date();
    newOrder.timeline = [];
    newOrder.timeline.push({ date: now, userId: user['sub'], state: 'ORDER' });
    const separatedCartItems: CartItem[] = [];

    try {
      for (const cartItem of createOrderDto.itemsList) {
        const getResult = await this.stockService.getMany(
          cartItem.productId,
          cartItem.amount,
        );
        if (getResult) separatedCartItems.push(cartItem);
      }
    } catch (e) {
      for (const cartItem of separatedCartItems) {
        await this.stockService.putMany(cartItem.productId, cartItem.amount);
      }
      throw new HttpException(
        'Problem when processing order',
        HttpStatus.CONFLICT,
      );
    }
    return await this.collection.insertOne(newOrder);
  }

  async findAll(
    user: UserRepresentation,
    userRole: RoleRepresentation,
  ): Promise<Order[]> {
    if (userRole.name === 'client')
    {
      const orders = (await this.collection
        .aggregate(
          [
            { $match: { userId: user['sub'] }},
            { $lookup: {
              from: 'products',
              let: { 'list': '$itemsList' },
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      $in: [ {$toString: '$_id'}, '$$list.productId' ]
                    },
                  },
                },
              ],
              'as': 'items'
            }}
          ])
        .toArray()) as unknown as Order[];
        return orders;
    } else if (userRole.name === 'manager')
    {
      return (await this.collection
      .aggregate(
        [
          { 
            $lookup: {
            from: 'products',
            let: { 'list': '$itemsList' },
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    $in: [ {$toString: '$_id'}, '$$list.productId' ]
                  },
                },
              },
            ],
            'as': 'items'
          }}]).toArray()) as unknown as Order[];
    } else if (userRole.name === 'stockist')
    {
        return (await this.collection
        .aggregate(
          [
            { $match: { $or:
              [
                {state: 'SEPARATING', timeline: { $elemMatch: {userId: user['sub']}}},
                {state: 'ORDER'}
              ]},
            },
            { 
              $lookup: {
              from: 'products',
              let: { 'list': '$itemsList' },
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      $in: [ {$toString: '$_id'}, '$$list.productId' ]
                    },
                  },
                },
              ],
              'as': 'items'
            }}]).toArray()) as unknown as Order[];
    } else if (userRole.name === 'delivery-person')
    {
      return (await this.collection
      .aggregate(
        [
          { $match: { $or:
            [
              {state: 'DELIVERY', timeline: { $elemMatch: {userId: user['sub']}}},
              {state: 'READY'}
            ]},
          },
          { 
            $lookup: {
            from: 'products',
            let: { 'list': '$itemsList' },
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    $in: [ {$toString: '$_id'}, '$$list.productId' ]
                  },
                },
              },
            ],
            'as': 'items'
          }}]).toArray()) as unknown as Order[];
    } else return [];
  }

  async findOne(
    id: ObjectId,
    user: UserRepresentation,
    userRole: RoleRepresentation,
  ) {
    return `This action returns a #${id} order`;
  }

  async update(
    id: ObjectId,
    updateOrderDto: UpdateOrderDto,
    user: UserRepresentation,
    userRole: RoleRepresentation,
  ) {
    const now = new Date();
    const order = await this.collection.findOne({_id: new ObjectId(id)})
    order.state = updateOrderDto.state
    order.timeline = [...order.timeline, { date: now, userId: user['sub'], state: updateOrderDto.state}]
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: order},
    );     
  }

}
