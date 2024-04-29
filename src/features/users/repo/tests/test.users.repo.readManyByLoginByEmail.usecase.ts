import { TestingModule } from '@nestjs/testing';
import { UsersRepoReadOneByLoginOrEmailUseCase } from '../use-cases/UsersRepoReadOneByLoginOrEmailUsecase';
import {
  UsersRepoCreateUserCommand,
  UsersRepoCreateUserUseCase,
} from '../use-cases/UsersRepoCreateUsecase';
import { UsersRepoReadOneByPropertyValueUseCase } from '../use-cases/UsersRepoReadOneByPropertyUsecase';
import {
  UsersRepoClearCommand,
  UsersRepoClearUseCase,
} from '../use-cases/UsersRepoClearUsecase';
import { TestUsersRepoTestingModule } from './settings/users.repo.testingModule';
import {
  UsersRepoReadManyByLoginByEmailCommand,
  UsersRepoReadManyByLoginByEmailUseCase,
} from '../use-cases/UsersRepoReadManyByLoginByEmailUsecase';
import { UserControllerRegistrationEntity } from 'src/features/users/controllers/entities/UsersControllerRegistrationEntity';

describe(`${UsersRepoReadOneByLoginOrEmailUseCase.name}: read user`, () => {
  let module: TestingModule;

  let createUseCase: UsersRepoCreateUserUseCase;
  let readByOneProperty: UsersRepoReadOneByPropertyValueUseCase;
  let readManyByLoginByEmailUseCase: UsersRepoReadManyByLoginByEmailUseCase;
  let clearUseCase: UsersRepoClearUseCase;

  beforeAll(async () => {
    module = await TestUsersRepoTestingModule.compile();

    await module.init();

    createUseCase = module.get<UsersRepoCreateUserUseCase>(
      UsersRepoCreateUserUseCase,
    );
    readManyByLoginByEmailUseCase =
      module.get<UsersRepoReadManyByLoginByEmailUseCase>(
        UsersRepoReadManyByLoginByEmailUseCase,
      );
    readByOneProperty = module.get<UsersRepoReadOneByPropertyValueUseCase>(
      UsersRepoReadOneByPropertyValueUseCase,
    );
    clearUseCase = module.get<UsersRepoClearUseCase>(UsersRepoClearUseCase);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Get user by login', async () => {
    let clearCommand = new UsersRepoClearCommand();

    let createCommand_1 = new UsersRepoCreateUserCommand(
      new UserControllerRegistrationEntity(
        'userqwe',
        'special@mail.com',
        '123123',
      ),
    );
    let createCommand_2 = new UsersRepoCreateUserCommand(
      new UserControllerRegistrationEntity(
        'user',
        'notspecial@mail.com',
        '123123',
      ),
    );
    let createCommand_3 = new UsersRepoCreateUserCommand(
      new UserControllerRegistrationEntity('bob', 'bob@mail.com', '123123'),
    );
    let createCommand_4 = new UsersRepoCreateUserCommand(
      new UserControllerRegistrationEntity('alice', 'alice@mail.com', '123123'),
    );

    let clearDb = await clearUseCase.execute(clearCommand);

    let createUser_1 = await createUseCase.execute(createCommand_1);
    let createUser_2 = await createUseCase.execute(createCommand_2);
    let createUser_3 = await createUseCase.execute(createCommand_3);
    let createUser_4 = await createUseCase.execute(createCommand_4);

    let findUsersByLoginByEmail = await readManyByLoginByEmailUseCase.execute(
      new UsersRepoReadManyByLoginByEmailCommand(
        createCommand_2.message.login,
        createCommand_3.message.email,
      ),
    );

    expect(findUsersByLoginByEmail).toMatchObject([createUser_2, createUser_3]);
  });
});
