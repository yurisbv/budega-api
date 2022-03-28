import { CartItem, OrderAddress, PAYMENT_MODE } from './orders';

export class CreateOrderDto {
  itemsList: CartItem[];
  orderAddress: OrderAddress;
  paymentMode: PAYMENT_MODE;
}
