import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { KCService } from '../keycloak/keycloak.service';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';

@Injectable()
export class UsersService {
  kc: KCService;

  constructor(private keycloak: KCService) {
    this.kc = keycloak;
  }

  async findAll(user: UserRepresentation) {
    const roles = await this.kc.getClientRoles();
    if (!roles.length) throw new HttpException('Invalid Content', 403);
    const response: UserRepresentation[] = [];
    for (const r of roles) {
      const res = await this.kc.getUsersWithRole(r.name);
      res
        .filter((u) => u.id != user['sub'])
        .forEach((u) => {
          u['clientRoles'] = r;
          response.push(u);
        });
    }
    return response;
  }

  async findOneUser(id: string) {
    return await this.kc.getUserById(id);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    user: UserRepresentation,
  ) {
    const res = await this.kc.updateUser(id, updateUserDto.budegaUser);
    //if (updateUserDto.recheckEmail) await this.kc.recheckEmail(id);
    //if (updateUserDto.resetPassword) await this.kc.resetPassword(id);
    return res;
  }

  async remove(id: string) {
    return await this.kc.removeUser(id);
  }

  async createClient(createUserDto: CreateUserDto) {
    
    createUserDto.username = createUserDto.email;
    createUserDto.credentials = [{value: createUserDto.password}]

    return await this.kc.addUser({
      username: createUserDto.username,
      email: createUserDto.email,
      enabled: true,
      credentials: createUserDto.credentials,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName

    }, 'client');
  }

  updateClient(id: string, updateUserDto: UpdateUserDto) {
    // TODO: Implements
    return { id, updateUserDto };
  }

  getClientInfo(id: string) {
    // TODO: Implements
    return { id };
  }

  async getAllRoles() {
    return await this.kc.getClientRoles();
  }

  async activeUser(id: string, state: boolean) {
    return await this.kc.activeUser(id, state);
  }

  async updateUserImage(id: string, imagePath: string) {
    return this.kc.updateUserAvatar(id, imagePath);
  }

  async createEmployee(
    createUserDto: CreateUserDto,
    role: RoleRepresentation,
    user: UserRepresentation,
  ) {
    // TODO: log this action
    createUserDto.username = createUserDto.email;
    delete createUserDto.role;
    return await this.kc.addEmployee(createUserDto, role);
  }
}
