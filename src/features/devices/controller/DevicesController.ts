import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  DeviceSerivceGetUserDevicesCommand,
  UserDevice,
} from '../use-cases/DevicesServiceGetUsersDevicesUsecase';
import {
  DeleteUserDevicesStatus,
  DeviceSerivceDeleteRestDevicesCommand,
} from '../use-cases/DevicesServiceDeleteRestDevicesUsecase';
import {
  DeleteCertainUserDeviceStatus,
  DeviceSerivceDeleteCertainDeviceCommand,
} from '../use-cases/DevicesServiceDeleteCertainDeviceUsecase';
import { ReadRefreshToken } from '../../../jwt/decorators/JwtRequestReadRefreshToken';
import { JwtServiceUserRefreshTokenLoad } from '../../../jwt/entities/JwtServiceRefreshTokenLoad';

@Controller('security/devices')
export class DeviceController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  async GetDevices(@ReadRefreshToken() token: JwtServiceUserRefreshTokenLoad) {
    let devices = await this.commandBus.execute<
      DeviceSerivceGetUserDevicesCommand,
      UserDevice[]
    >(new DeviceSerivceGetUserDevicesCommand(token));

    return devices;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteDevices(
    @ReadRefreshToken() refreshToken: JwtServiceUserRefreshTokenLoad,
  ) {
    let delRestDevices = await this.commandBus.execute<
      DeviceSerivceDeleteRestDevicesCommand,
      DeleteUserDevicesStatus
    >(new DeviceSerivceDeleteRestDevicesCommand(refreshToken));

    return;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteCertainDevice(
    @Param('id') id: string,
    @ReadRefreshToken() refreshToken: JwtServiceUserRefreshTokenLoad,
  ) {
    let deleteStatus = await this.commandBus.execute<
      DeviceSerivceDeleteCertainDeviceCommand,
      DeleteCertainUserDeviceStatus
    >(new DeviceSerivceDeleteCertainDeviceCommand(refreshToken, id));

    switch (deleteStatus) {
      case DeleteCertainUserDeviceStatus.Success:
        return;

      case DeleteCertainUserDeviceStatus.NotFound:
        throw new NotFoundException();
        break;

      case DeleteCertainUserDeviceStatus.WrongUserActionForbidden:
        throw new ForbiddenException();
        break;
    }
  }
}
