import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtServiceUserAccessTokenLoad } from 'src/jwt/entities/JwtServiceAccessTokenLoad';
import { UsersRepoService } from '../../repo/UsersRepoService';

export type UserPersonalInfo = {
  email: string;
  login: string;
  userId: string;
};

export class UsersServiceGetMyDataCommand {
  constructor(public useToken: JwtServiceUserAccessTokenLoad) {}
}

@Injectable()
@CommandHandler(UsersServiceGetMyDataCommand)
export class UsersServiceGetMyDataUseCase
  implements ICommandHandler<UsersServiceGetMyDataCommand, UserPersonalInfo>
{
  constructor(private userRepo: UsersRepoService) {}

  async execute(
    command: UsersServiceGetMyDataCommand,
  ): Promise<UserPersonalInfo> {
    let foundUser = await this.userRepo.ReadOneByPropertyValue(
      'login',
      command.useToken.login,
    );

    if (!foundUser) return null;

    let result: UserPersonalInfo = {
      email: foundUser.email,
      login: foundUser.login,
      userId: foundUser.id.toString(),
    };

    return result;
  }
}
