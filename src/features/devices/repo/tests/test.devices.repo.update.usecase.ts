import { TestingModule } from '@nestjs/testing';
import { TestDevicesRepoTestingModule } from './settings/devices.repo.testingModule';
import { DeviceRepoService } from '../DevicesRepoService';
import { UserControllerRegistrationEntity } from 'src/features/users/controllers/entities/UsersControllerRegistrationEntity';
import { UsersRepoService } from 'src/features/users/repo/UsersRepoService';
import { RequestDeviceEntity } from '../../decorators/entity/RequestDeviceEntity';

describe(`DeviceRepoUpdate test`, () => {
  let module: TestingModule;
  let deviceRepo: DeviceRepoService;
  let userRepo: UsersRepoService;

  beforeAll(async () => {
    module = await TestDevicesRepoTestingModule.compile();

    await module.init();

    deviceRepo = module.get<DeviceRepoService>(DeviceRepoService);
    userRepo = module.get<UsersRepoService>(UsersRepoService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Device updated successfully', async () => {
    await deviceRepo.DeleteAll();
    await userRepo.DeleteAll();

    let device = new RequestDeviceEntity('phone', '1.1.1.125');
    let user = new UserControllerRegistrationEntity(
      'Joe',
      'joe@mail.com',
      '123123',
    );

    let savedUser = await userRepo.Create(user);

    let createdDevice = await deviceRepo.Create(device, savedUser);
    let initIp = createdDevice.ip;

    let newIp = '1.2.3.123';
    createdDevice.ip = newIp;

    let updatedDevice = await deviceRepo.UpdateOne(createdDevice);

    expect(createdDevice.name).toEqual(device.name);
    expect(initIp).toEqual(device.ip);
  });
});
