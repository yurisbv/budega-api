export const COLLECTION = 'orders';

export type PAYMENT_MODE = 'MONEY' | 'CART' | 'PIX';
export type ORDER_FINISHED = 'CANCELLED' | 'DELIVERED' | 'UNDELIVERED';
export type ORDER_STATE =
  | 'ORDER'
  | 'SEPARATING'
  | 'READY'
  | 'DELIVERY'
  | ORDER_FINISHED;

export interface TimelineItem {
  date: Date;
  userId: string;
  state: ORDER_STATE;
}

export interface OrderAddress {
  street: string,
  cep: string,
  number: string,
  district: string
}

export class Order {
  itemsList: CartItem[];
  userId: string;
  orderAddress: OrderAddress;
  paymentMode: PAYMENT_MODE;
  state: ORDER_STATE;
  timeline: TimelineItem[];
}

export interface CartItem {
  amount: number;
  productId: string;
}
