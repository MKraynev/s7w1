import { TestingModule } from '@nestjs/testing';
import {
  UsersRepoCreateUserCommand,
  UsersRepoCreateUserUseCase,
} from '../use-cases/UsersRepoCreateUsecase';
import {
  UsersRepoReadOneByPropertyValueCommand,
  UsersRepoReadOneByPropertyValueUseCase,
} from '../use-cases/UsersRepoReadOneByPropertyUsecase';
import { TestUsersRepoTestingModule } from './settings/users.repo.testingModule';
import { UsersRepoClearUseCase } from '../use-cases/UsersRepoClearUsecase';
import { UsersRepoService } from '../UsersRepoService';
import { DeviceRepoService } from '../../../devices/repo/DevicesRepoService';
import { UserControllerRegistrationEntity } from '../../controllers/entities/UsersControllerRegistrationEntity';
describe('UsersRepo UseCase: Clear', () => {
  let module: TestingModule;

  let createUseCase: UsersRepoCreateUserUseCase;
  let readByPropertyUseCase: UsersRepoReadOneByPropertyValueUseCase;
  let clearUseCase: UsersRepoClearUseCase;

  let deviceRepo: DeviceRepoService;
  let userRepo: UsersRepoService;

  beforeAll(async () => {
    module = await TestUsersRepoTestingModule.compile();

    await module.init();

    createUseCase = module.get<UsersRepoCreateUserUseCase>(
      UsersRepoCreateUserUseCase,
    );
    readByPropertyUseCase = module.get<UsersRepoReadOneByPropertyValueUseCase>(
      UsersRepoReadOneByPropertyValueUseCase,
    );
    clearUseCase = module.get<UsersRepoClearUseCase>(UsersRepoClearUseCase);

    deviceRepo = module.get<DeviceRepoService>(DeviceRepoService);
    userRepo = module.get<UsersRepoService>(UsersRepoService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Clear after CreateUser -> User doesn`t exist(use ReadUserById)', async () => {
    let createCommand: UsersRepoCreateUserCommand =
      new UsersRepoCreateUserCommand(
        new UserControllerRegistrationEntity(
          'Max123',
          'max123@mail.com',
          '123123',
        ),
      );
    let createdUser = await createUseCase.execute(createCommand);
    let readUser = await readByPropertyUseCase.execute(
      new UsersRepoReadOneByPropertyValueCommand({
        propertyName: 'login',
        propertyValue: createCommand.message.login,
      }),
    );

    expect(createdUser).toMatchObject({
      id: expect.any(Number),
      login: createCommand.message.login,
      email: createCommand.message.email,
      salt: expect.any(String),
      hash: expect.any(String),
      emailConfirmed: false,
      refreshPasswordTime: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(createdUser).toEqual(readUser);

    // let clearDevices = await deviceRepo.DeleteAll();
    let clearUsers = await userRepo.DeleteAll();

    expect(clearUsers).toEqual(expect.any(Number));

    let readCommand: UsersRepoReadOneByPropertyValueCommand =
      new UsersRepoReadOneByPropertyValueCommand({
        propertyName: 'login',
        propertyValue: createCommand.message.login,
      });
    let foundUser = await readByPropertyUseCase.execute(readCommand);

    expect(foundUser).toEqual(null);
  });
});
