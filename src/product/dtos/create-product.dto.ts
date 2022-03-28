import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  isActive?: boolean;

  constructor() {
    this.isActive = false;
  }
}
