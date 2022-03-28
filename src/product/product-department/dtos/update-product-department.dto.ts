import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsNotEmpty()
  image?: string;
}
