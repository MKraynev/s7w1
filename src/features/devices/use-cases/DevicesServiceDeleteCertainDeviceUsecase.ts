import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtServiceUserRefreshTokenLoad } from 'src/jwt/entities/JwtServiceRefreshTokenLoad';
import { DeviceRepoService } from '../repo/DevicesRepoService';

export enum DeleteCertainUserDeviceStatus {
  Success,
  NotFound,
  WrongUserActionForbidden,
}

export class DeviceSerivceDeleteCertainDeviceCommand {
  constructor(
    public refreshToken: JwtServiceUserRefreshTokenLoad,
    public deleteDeviceId: string,
  ) {}
}

@Injectable()
@CommandHandler(DeviceSerivceDeleteCertainDeviceCommand)
export class DeviceSerivceDeleteCertainDeviceUseCase
  implements
    ICommandHandler<
      DeviceSerivceDeleteCertainDeviceCommand,
      DeleteCertainUserDeviceStatus
    >
{
  constructor(private deviceRepo: DeviceRepoService) {}
  async execute(
    command: DeviceSerivceDeleteCertainDeviceCommand,
  ): Promise<DeleteCertainUserDeviceStatus> {
    let foundDevice = await this.deviceRepo.ReadOneFullyById(
      command.deleteDeviceId,
    );

    if (!foundDevice) return DeleteCertainUserDeviceStatus.NotFound;

    if (foundDevice.user.id.toString() !== command.refreshToken.id)
      return DeleteCertainUserDeviceStatus.WrongUserActionForbidden;

    let delDeviceCount = await this.deviceRepo.DeleteOne(
      command.deleteDeviceId,
    );

    return DeleteCertainUserDeviceStatus.Success;
  }
}
