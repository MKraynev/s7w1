import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtServiceUserRefreshTokenLoad } from 'src/jwt/entities/JwtServiceRefreshTokenLoad';
import { DeviceRepoService } from '../repo/DevicesRepoService';

export class UserDevice {
  constructor(
    public ip: string,
    public title: string,
    public lastActiveDate: string,
    public deviceId: string,
  ) {}
}

export class DeviceSerivceGetUserDevicesCommand {
  constructor(public refreshToken: JwtServiceUserRefreshTokenLoad) {}
}

@Injectable()
@CommandHandler(DeviceSerivceGetUserDevicesCommand)
export class DeviceSerivceGetUserDevicesUsecase
  implements ICommandHandler<DeviceSerivceGetUserDevicesCommand, UserDevice[]>
{
  constructor(private deviceRepo: DeviceRepoService) {}

  async execute(
    command: DeviceSerivceGetUserDevicesCommand,
  ): Promise<UserDevice[]> {
    let foundDevices = await this.deviceRepo.ReadManyByUserId(
      command.refreshToken.id,
    );

    let userDevices = foundDevices.map(
      (device) =>
        new UserDevice(
          device.ip,
          device.name,
          device.refreshTime.toISOString(),
          device.id.toString(),
        ),
    );

    return userDevices;
  }
}
