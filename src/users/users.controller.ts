import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/image-upload.utils';
import { KeycloakAuthGuard } from '../keycloak/keycloak.auth.guard';
import { Roles } from '../keycloak/keycloak.decorator';
import { KeycloakUserContext } from '../keycloak/utils/user.context';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('client')
  createClient(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createClient(createUserDto);
  }

  @Post('employee')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  createEmployee(
    @Body() createUserDto: CreateUserDto,
    @KeycloakUserContext() user: UserRepresentation,
  ) {
    return this.usersService.createEmployee(
      createUserDto,
      createUserDto.role,
      user,
    );
  }

  @Get()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  getUsers(@KeycloakUserContext() user: UserRepresentation) {
    return this.usersService.findAll(user);
  }

  @Get('roles')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  getRoles() {
    return this.usersService.getAllRoles();
  }

  @Get(':id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  findOne(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Get('client/:id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  findClient(@Param('id') id: string) {
    return this.usersService.getClientInfo(id);
  }

  @Put('client/:id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  updateClient(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateClient(id, updateUserDto);
  }

  @Put(':id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @KeycloakUserContext() user: UserRepresentation,
  ) {
    return this.usersService.updateUser(id, updateUserDto, user);
  }

  @Post('image/:id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `./uploads`,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.usersService.updateUserImage(String(id), image.path);
  }

  @Post('active/:id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  async activeUser(@Param('id') id: string, @Body() state: any) {
    return await this.usersService.activeUser(id, state.state);
  }

  @Delete(':id')
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:manager'])
  remove(@Param('id') id: string) {
    // TODO: usuário só pode ser removido se não houver nenhum processo não finalizado
    // TODO: adicionar uma cópia do usuário deletado em um document de usuário deletado no banco de dados
    return this.usersService.remove(id);
  }
}
