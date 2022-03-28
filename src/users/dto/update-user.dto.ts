import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto {
  budegaUser: CreateUserDto;
  resetPassword: boolean;
  recheckEmail: boolean;
}
