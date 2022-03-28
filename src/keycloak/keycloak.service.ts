import { HttpException, Injectable } from '@nestjs/common';
import KcAdminClient from '@keycloak/keycloak-admin-client';

import { GrantTypes } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';

@Injectable()
export class KCService {
  kcAdminClient: KcAdminClient;
  userInfoURL: string;
  client = {
    name: process.env.KC_APP_NAME,
    id: process.env.KC_APP_ID,
  };

  constructor(private httpService: HttpService) {
    this.kcAdminClient = new KcAdminClient({
      baseUrl: process.env.KC_BASE_URL,
      realmName: process.env.KC_REALM_NAME,
    });
    this.userInfoURL = `${process.env.KC_BASE_URL}/realms/${process.env.KC_REALM_NAME}/protocol/openid-connect/userinfo`;
  }

  protected async connect(): Promise<void> {
    await this.kcAdminClient.auth({
      username: process.env.KC_USERNAME,
      password: process.env.KC_PASSWORD,
      clientId: process.env.KC_API_CLIENT,
      grantType: process.env.KC_GRANT_TYPE as GrantTypes,
      clientSecret: process.env.KC_API_SECRET,
    });
  }

  async getUsersWithRole(role: string): Promise<UserRepresentation[]> {
    await this.connect();
    // return await this.kcAdminClient.users.find();
    return await this.kcAdminClient.clients.findUsersWithRole({
      id: this.client.id,
      roleName: role,
    });
  }

  async getClientRoles(): Promise<RoleRepresentation[]> {
    await this.connect();
    return this.kcAdminClient.clients.listRoles({ id: this.client.id });
  }

  async getUserInfo(token: string): Promise<UserRepresentation> {
    await this.connect();
    const userRepresentation$ = this.httpService
      .get<UserRepresentation>(this.userInfoURL, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .pipe(map((res) => res.data));
    return await lastValueFrom(userRepresentation$);
  }

  async getUserClientRoles(userId: string): Promise<RoleRepresentation[]> {
    await this.connect();
    return await this.kcAdminClient.users.listClientRoleMappings({
      id: userId,
      clientUniqueId: this.client.id,
    });
  }

  async addUser(
    newUser: UserRepresentation,
    role: string,
    client?: string,
  ): Promise<void> {
    await this.connect();
    const user = await this.kcAdminClient.users.create(newUser);
    const roleInfo = await this.kcAdminClient.clients.findRole({
      id: this.client.id,
      roleName: role,
      realm: process.env.KC_REALM_NAME,
    });

    if (!roleInfo) throw new HttpException('Invalid Role', 400);
    return await this.kcAdminClient.users.addClientRoleMappings({
      id: user.id,
      clientUniqueId: client || this.client.id,
      roles: [
        {
          id: roleInfo.id,
          name: roleInfo.name,
        },
      ],
    });
  }

  async addEmployee(
    newUser: UserRepresentation,
    role: RoleRepresentation,
  ): Promise<void> {
    await this.connect();
    const addUser = await this.kcAdminClient.users.create(newUser);
    if (addUser)
      return await this.kcAdminClient.users.addClientRoleMappings({
        id: addUser.id,
        clientUniqueId: this.client.id,
        roles: [
          {
            id: role.id,
            name: role.name,
          },
        ],
      });
  }

  async getUserById(id: string) {
    await this.connect();
    let user = await this.kcAdminClient.users.findOne({ id: id });
    let roles: RoleRepresentation[];
    if (user) {
      roles = await this.kcAdminClient.users.listClientRoleMappings({
        id: user.id,
        clientUniqueId: this.client.id,
      });
      user = { ...user, clientRoles: roles };
    }
    return user;
  }

  async updateUserAvatar(id: string, imagePath: string) {
    await this.connect();
    const user = await this.kcAdminClient.users.findOne({ id: id });
    if (user)
      return await this.kcAdminClient.users.update(
        { id },
        {
          attributes: { avatar: imagePath },
        },
      );
  }

  async activeUser(id: string, state: boolean) {
    await this.connect();
    return await this.kcAdminClient.users.update(
      { id: id },
      {
        enabled: state,
      },
    );
  }

  async updateUser(
    id: string,
    updateUserDto: UserRepresentation,
  ): Promise<void> {
    await this.connect();
    const actualRole = await this.kcAdminClient.users.listClientRoleMappings({
      id: id,
      clientUniqueId: this.client.id,
    });

    if (actualRole[0].id !== updateUserDto.clientRoles.id) {
      await this.kcAdminClient.users.delClientRoleMappings({
        id: id,
        clientUniqueId: this.client.id,
        roles: [
          {
            id: actualRole[0].id,
            name: actualRole[0].name,
          },
        ],
      });
      await this.kcAdminClient.users.addClientRoleMappings({
        id: id,
        clientUniqueId: this.client.id,
        roles: [
          {
            id: updateUserDto.clientRoles.id,
            name: updateUserDto.clientRoles.name,
          },
        ],
      });
    }

    return await this.kcAdminClient.users.update(
      { id: id },
      {
        email: updateUserDto.email,
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        enabled: updateUserDto.enabled,
      },
    );
  }

  async removeUser(id: string): Promise<void> {
    return await this.kcAdminClient.users.del({ id: id });
  }

  async recheckEmail(id: string): Promise<void> {
    return await this.kcAdminClient.users.sendVerifyEmail({
      id: id,
    });
  }

  async resetPassword(id: string): Promise<void> {
    return await this.kcAdminClient.users.executeActionsEmail({
      id: id,
      lifespan: 43200,
      actions: [RequiredActionAlias.UPDATE_PASSWORD],
    });
  }
}
