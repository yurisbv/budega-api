import {
  ProductDepartment,
  ProductBrand,
  ProductCategory,
  ProductStock,
} from '../../interfaces';
import { StockHistoryAction } from '../product-stock-history/dtos/product-stock-history';

export const COLLECTION = 'products';

export class Product {
  _id: string;
  name: string;
  isActive: boolean;
  price: number;
  images: string[];
  department: ProductDepartment;
  // TODO: add Unidade de medida Type: peso, litro, unidade
  brand: ProductBrand;
  categories: ProductCategory[];
  stock: ProductStock;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductStockHistory {
  id: string;
  action: StockHistoryAction;
  agent: string; // Users Keycloak ID
  createdAt: string;
}
