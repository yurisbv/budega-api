import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductBrandDto {
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
