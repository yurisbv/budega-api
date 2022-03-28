import { Test, TestingModule } from '@nestjs/testing';
import { ProductBrandController } from './product-brand.controller';
import { ProductBrandService } from './product-brand.service';

describe('ProductBrandController', () => {
  let controller: ProductBrandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductBrandController],
      providers: [ProductBrandService],
    }).compile();

    controller = module.get<ProductBrandController>(ProductBrandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
