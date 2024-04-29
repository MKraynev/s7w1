import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepoService } from '../../repo/UsersRepoService';
import { JwtServiceUserRefreshTokenLoad } from '../../../../jwt/entities/JwtServiceRefreshTokenLoad';
import { RequestDeviceEntity } from '../../../devices/decorators/entity/RequestDeviceEntity';
import { DeviceRepoService } from '../../../devices/repo/DevicesRepoService';
import { JwtHandlerService } from '../../../../jwt/JwtService';

export enum RefreshTokenStatus {
  Success,
  UserNotFound,
  UserDeviceNotFound,
  WrongDevice,
  TokenExpired,
}

export class RefreshTokenDto {
  /**
   *
   */
  constructor(
    public status: RefreshTokenStatus,
    public accessToken?: string,
    public refreshToken?: string,
  ) {}
}

export class UsersSerivceRefreshTokenCommand {
  constructor(
    public refreshToken: JwtServiceUserRefreshTokenLoad,
    public deviceInfo: RequestDeviceEntity,
  ) {}
}

@Injectable()
@CommandHandler(UsersSerivceRefreshTokenCommand)
export class UsersSerivceRefreshTokenUseCase
  implements ICommandHandler<UsersSerivceRefreshTokenCommand, RefreshTokenDto>
{
  constructor(
    private userRepo: UsersRepoService,
    private deviceRepo: DeviceRepoService,
    private jwtService: JwtHandlerService,
  ) {}

  async execute(
    command: UsersSerivceRefreshTokenCommand,
  ): Promise<RefreshTokenDto> {
    let foundUser = await this.userRepo.ReadOneById(command.refreshToken.id);

    if (!foundUser) return new RefreshTokenDto(RefreshTokenStatus.UserNotFound);

    let usedDevice = await foundUser.devices.find(
      (device) => device.id.toString() === command.refreshToken.deviceId,
    );

    if (!usedDevice)
      return new RefreshTokenDto(RefreshTokenStatus.UserDeviceNotFound);

    if (usedDevice.refreshTime.toISOString() !== command.refreshToken.time)
      return new RefreshTokenDto(RefreshTokenStatus.TokenExpired);

    usedDevice.ip = command.deviceInfo.ip;

    usedDevice.refreshTime = new Date();

    let updatedDevice = await this.deviceRepo.UpdateOne(usedDevice);

    let tokens = await this.jwtService.GenerateUserLoginTokens(
      foundUser.id,
      foundUser.login,
      usedDevice,
    );

    return new RefreshTokenDto(
      RefreshTokenStatus.Success,
      tokens.accessTokenCode,
      tokens.refreshTokenCode,
    );
  }
}
