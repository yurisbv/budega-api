import { StockHistoryAction } from './product-stock-history';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductStockHistoryDto {
  @IsNotEmpty()
  action: StockHistoryAction;

  @IsNotEmpty()
  @IsString()
  agent: string; // Users Keycloak ID
}
