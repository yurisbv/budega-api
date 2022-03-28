import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBase64,
  IsArray,
} from 'class-validator';
import { ProductBrand } from '../product-brand/dtos/product-brand';
import { ProductCategory } from '../product-category/dtos/product-category';
import { ProductDepartment } from '../product-department/dtos/product-department';
import { ProductStock } from '../product-stock/dtos/product-stock';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  price?: number;

  @IsBase64()
  @IsArray()
  @IsOptional()
  images?: BinaryType[];

  @IsOptional()
  department?: ProductDepartment;

  @IsOptional()
  brand?: ProductBrand;

  @IsOptional()
  @IsArray()
  categories?: ProductCategory[];

  @IsOptional()
  stock?: ProductStock;

  @IsOptional()
  stockAmount?: number;

  @IsOptional()
  stockMinimumAlert?: number;
}
