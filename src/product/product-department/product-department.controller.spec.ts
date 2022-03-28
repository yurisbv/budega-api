import { Test, TestingModule } from '@nestjs/testing';
import { ProductDepartmentController } from './product-department.controller';
import { ProductDepartmentService } from './product-department.service';

describe('ProductDepartmentController', () => {
  let controller: ProductDepartmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductDepartmentController],
      providers: [ProductDepartmentService],
    }).compile();

    controller = module.get<ProductDepartmentController>(ProductDepartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
