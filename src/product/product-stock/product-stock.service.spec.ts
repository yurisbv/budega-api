import { Test, TestingModule } from '@nestjs/testing';
import { ProductStockService } from './product-stock.service';

describe('ProductStockService', () => {
  let service: ProductStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductStockService],
    }).compile();

    service = module.get<ProductStockService>(ProductStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
