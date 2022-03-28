import { Test, TestingModule } from '@nestjs/testing';
import { ProductDepartmentService } from './product-department.service';

describe('ProductDepartmentService', () => {
  let service: ProductDepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductDepartmentService],
    }).compile();

    service = module.get<ProductDepartmentService>(ProductDepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
