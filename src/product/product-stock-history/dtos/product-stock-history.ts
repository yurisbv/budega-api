export enum StockHistoryAction {
  GET = 'Get',
  PUSH = 'Push',
}

export const COLLECTION = 'productStockHistory';

export class ProductStockHistory {
  id: string;
  action: StockHistoryAction;
  agent: string; // Users Keycloak ID
  createdAt: string;
}
