import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtServiceUserRefreshTokenLoad } from 'src/jwt/entities/JwtServiceRefreshTokenLoad';
import { DeviceRepoService } from '../repo/DevicesRepoService';

export enum DeleteUserDevicesStatus {
  Success,
  TokenExpired,
}

export class DeviceSerivceDeleteRestDevicesCommand {
  constructor(public refreshToken: JwtServiceUserRefreshTokenLoad) {}
}

@Injectable()
@CommandHandler(DeviceSerivceDeleteRestDevicesCommand)
export class DeviceSerivceDeleteRestDevicesUseCase
  implements
    ICommandHandler<
      DeviceSerivceDeleteRestDevicesCommand,
      DeleteUserDevicesStatus
    >
{
  constructor(private deviceRepo: DeviceRepoService) {}
  async execute(
    command: DeviceSerivceDeleteRestDevicesCommand,
  ): Promise<DeleteUserDevicesStatus> {
    let delDevicesCount = await this.deviceRepo.DeleteAllUserDevicesExcept(
      command.refreshToken.id,
      command.refreshToken.deviceId,
    );

    return delDevicesCount;
  }
}
