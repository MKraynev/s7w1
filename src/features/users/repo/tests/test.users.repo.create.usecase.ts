import { TestingModule } from '@nestjs/testing';
import {
  UsersRepoReadOneByPropertyValueCommand,
  UsersRepoReadOneByPropertyValueUseCase,
} from '../use-cases/UsersRepoReadOneByPropertyUsecase';
import { TestUsersRepoTestingModule } from './settings/users.repo.testingModule';
import { UserRepoEntity } from '../entities/UsersRepoEntity';
import {
  UsersRepoCreateUserCommand,
  UsersRepoCreateUserUseCase,
} from '../use-cases/UsersRepoCreateUsecase';
import { UserControllerRegistrationEntity } from '../../controllers/entities/UsersControllerRegistrationEntity';

describe('UsersRepo UseCase: Create', () => {
  let module: TestingModule;

  let createUseCase: UsersRepoCreateUserUseCase;
  let readByPropertyUseCase: UsersRepoReadOneByPropertyValueUseCase;

  beforeAll(async () => {
    module = await TestUsersRepoTestingModule.compile();

    await module.init();

    createUseCase = module.get<UsersRepoCreateUserUseCase>(
      UsersRepoCreateUserUseCase,
    );
    readByPropertyUseCase = module.get<UsersRepoReadOneByPropertyValueUseCase>(
      UsersRepoReadOneByPropertyValueUseCase,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('Create user -> dto: UserRepoEntity', async () => {
    let command: UsersRepoCreateUserCommand = new UsersRepoCreateUserCommand(
      new UserControllerRegistrationEntity(
        'TestName',
        'testemail@mail.com',
        '123123',
      ),
    );
    let createdUser: UserRepoEntity = (await createUseCase.execute(
      command,
    )) as UserRepoEntity;

    expect(createdUser).toMatchObject({
      id: expect.any(Number),
      login: command.message.login,
      email: command.message.email,
      salt: expect.any(String),
      hash: expect.any(String),
      emailConfirmed: false,
      refreshPasswordTime: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('Create user -> user exist in DB(use ReadUserById)', async () => {
    let command: UsersRepoCreateUserCommand = new UsersRepoCreateUserCommand(
      new UserControllerRegistrationEntity('Joe', 'joe@mail.com', '123123'),
    );
    let createdUser = await createUseCase.execute(command);

    let readCommand: UsersRepoReadOneByPropertyValueCommand =
      new UsersRepoReadOneByPropertyValueCommand({
        propertyName: 'id',
        propertyValue: createdUser.id,
      });
    let foundUser = await readByPropertyUseCase.execute(readCommand);

    expect(createdUser).toEqual(foundUser);
  });

  it('Create user with wrong login field -> return error. User not exist in DB', async () => {
    let command: UsersRepoCreateUserCommand = new UsersRepoCreateUserCommand(
      new UserControllerRegistrationEntity(
        'UserUserUserUser12312313123',
        'user@mail.com',
        '123123',
      ),
    );
    let createdUser = await createUseCase.execute(command);

    let readCommand: UsersRepoReadOneByPropertyValueCommand =
      new UsersRepoReadOneByPropertyValueCommand({
        propertyName: 'login',
        propertyValue: command.message.login,
      });
    let foundUser = await readByPropertyUseCase.execute(readCommand);
  });
});
