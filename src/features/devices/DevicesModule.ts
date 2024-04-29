import { Module } from '@nestjs/common';
import { DeviceSerivceGetUserDevicesUsecase } from './use-cases/DevicesServiceGetUsersDevicesUsecase';
import { DeviceController } from './controller/DevicesController';
import { CqrsModule } from '@nestjs/cqrs';
import { DeviceSerivceDeleteRestDevicesUseCase } from './use-cases/DevicesServiceDeleteRestDevicesUsecase';
import { DeviceSerivceDeleteCertainDeviceUseCase } from './use-cases/DevicesServiceDeleteCertainDeviceUsecase';
import { DeviceRepoModule } from './repo/DevicesRepoModule';

export const DeviceUseCases = [
  DeviceSerivceGetUserDevicesUsecase,
  DeviceSerivceDeleteRestDevicesUseCase,
  DeviceSerivceDeleteCertainDeviceUseCase,
];

@Module({
  imports: [DeviceRepoModule, CqrsModule],
  controllers: [DeviceController],
  providers: [...DeviceUseCases],
})
export class DevicesModule {}
