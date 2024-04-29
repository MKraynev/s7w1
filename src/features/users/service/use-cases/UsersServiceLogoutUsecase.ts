import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestDeviceEntity } from '../../../devices/decorators/entity/RequestDeviceEntity';
import { JwtServiceUserRefreshTokenLoad } from '../../../../jwt/entities/JwtServiceRefreshTokenLoad';
import { DeviceRepoService } from '../../../devices/repo/DevicesRepoService';
export enum LogoutStatus {
  Success,
  ExpiredToken,
  WrongDevice,
  DeviceNotFound,
}

export class UsersServiceLogoutCommand {
  constructor(
    public requestDeviceInfo: RequestDeviceEntity,
    public refreshToken: JwtServiceUserRefreshTokenLoad,
  ) {}
}

@Injectable()
@CommandHandler(UsersServiceLogoutCommand)
export class UsersServiceLogoutUseCase
  implements ICommandHandler<UsersServiceLogoutCommand, LogoutStatus>
{
  constructor(private deviceRepo: DeviceRepoService) {}

  async execute(command: UsersServiceLogoutCommand): Promise<LogoutStatus> {
    let foundDevice = await this.deviceRepo.ReadOneFullyById(
      command.refreshToken.deviceId,
    );

    if (!foundDevice) return LogoutStatus.DeviceNotFound;

    if (foundDevice.refreshTime.toISOString() !== command.refreshToken.time)
      return LogoutStatus.ExpiredToken;

    let delDevice = await this.deviceRepo.DeleteOne(
      command.refreshToken.deviceId,
    );

    return LogoutStatus.Success;
  }
}
