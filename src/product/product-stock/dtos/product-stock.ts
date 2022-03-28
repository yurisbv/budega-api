import { ProductStockHistory } from '../../product-stock-history/dtos/product-stock-history';

export const COLLECTION = 'productStock';

export enum StockStatus {
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  IN_STOCK = 'IN_STOCK',
  RUNNING_LOW = 'RUNNING_LOW',
}

export class ProductStock {
  _id: string;
  productId: string;
  amount: number;
  minimumAlert: number;
  status: StockStatus;
  uid: string;
  stockHistory: ProductStockHistory;
  createdAt: string;
  updatedAt: string;
}
