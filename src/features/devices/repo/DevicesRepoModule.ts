import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceRepoEntity } from './entities/DevicesRepoEntity';
import { Module } from '@nestjs/common';
import { DeviceRepoService } from './DevicesRepoService';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceRepoEntity])],
  providers: [DeviceRepoService],
  exports: [DeviceRepoService],
})
export class DeviceRepoModule {}
