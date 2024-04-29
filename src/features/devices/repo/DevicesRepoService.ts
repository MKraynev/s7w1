import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceRepoEntity } from './entities/DevicesRepoEntity';
import { Repository } from 'typeorm';
import { RequestDeviceEntity } from '../decorators/entity/RequestDeviceEntity';
import { UserRepoEntity } from 'src/features/users/repo/entities/UsersRepoEntity';

@Injectable()
export class DeviceRepoService {
  constructor(
    @InjectRepository(DeviceRepoEntity)
    private deviceRepo: Repository<DeviceRepoEntity>,
  ) {}

  public async Create(
    deviceInfo: RequestDeviceEntity,
    user: UserRepoEntity,
  ): Promise<DeviceRepoEntity> {
    let repoDevice = DeviceRepoEntity.Init(deviceInfo);
    repoDevice.user = user;
    repoDevice.userId = user.id;

    let savedDevice = await this.deviceRepo.save(repoDevice);

    return savedDevice;
  }

  public async UpdateOne(device: DeviceRepoEntity): Promise<DeviceRepoEntity> {
    let updatedDevice = await this.deviceRepo.save(device);

    return updatedDevice;
  }

  public async DeleteAll() {
    let delAll = await this.deviceRepo.delete({});

    return delAll.affected;
  }
  public async ReadAll() {
    return await this.deviceRepo.find({});
  }

  public async DeleteOne(id: string) {
    let numId = +id;

    let del = await this.deviceRepo.delete({ id: numId });

    return del.affected;
  }

  public async ReadOneFullyById(id: string) {
    let numId = +id;

    let foundDevice = await this.deviceRepo.find({
      where: { id: numId },
      relations: { user: true },
      take: 1,
    });

    return foundDevice[0];
  }

  public async ReadOneFullyOrCreate(
    user: UserRepoEntity,
    deviceInfo: RequestDeviceEntity,
  ): Promise<DeviceRepoEntity> {
    let findOne = (await this.deviceRepo.find({
      where: [{ userId: user.id }, { name: deviceInfo.name }],
      relations: { user: true },
      take: 1,
    })[0]) as DeviceRepoEntity;

    if (!findOne) findOne = await this.Create(deviceInfo, user);
    else {
      findOne.ip = deviceInfo.ip;
    }

    return findOne;
  }

  public async ReadManyByProperty(
    propertyName: keyof DeviceRepoEntity,
    propertyValue: any,
  ) {
    let findRule: any = {};

    findRule[propertyName] = propertyValue;

    let foundDevice = await this.deviceRepo.find({ where: findRule });
    return foundDevice;
  }

  public async ReadManyByUserId(userId: string) {
    let userIdNum = +userId;

    let foundDevice = await this.deviceRepo.find({
      where: { userId: userIdNum },
    });
    return foundDevice;
  }

  public async DeleteAllUserDevicesExcept(
    userId: string,
    exceptDeviceId: string,
  ) {
    let id_num = +exceptDeviceId;
    let userId_num = +userId;
    let del = await this.deviceRepo
      .createQueryBuilder()
      .delete()
      .where('id != :id', { id: id_num })
      .andWhere('userId = :userId', { userId: userId_num })
      .execute();

    return del.affected;
  }
}
