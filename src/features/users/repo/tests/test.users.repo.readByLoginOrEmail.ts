import { TestingModule } from '@nestjs/testing';
import {
  UsersRepoReadOneByLoginOrEmailCommand,
  UsersRepoReadOneByLoginOrEmailUseCase,
} from '../use-cases/UsersRepoReadOneByLoginOrEmailUsecase';
import {
  UsersRepoCreateUserCommand,
  UsersRepoCreateUserUseCase,
} from '../use-cases/UsersRepoCreateUsecase';
import {
  UsersRepoReadOneByPropertyValueCommand,
  UsersRepoReadOneByPropertyValueUseCase,
} from '../use-cases/UsersRepoReadOneByPropertyUsecase';
import {
  UsersRepoClearCommand,
  UsersRepoClearUseCase,
} from '../use-cases/UsersRepoClearUsecase';
import { TestUsersRepoTestingModule } from './settings/users.repo.testingModule';
import { UserControllerRegistrationEntity } from '../../controllers/entities/UsersControllerRegistrationEntity';

describe(`${UsersRepoReadOneByLoginOrEmailUseCase.name}: read user`, () => {
  let module: TestingModule;

  let createUseCase: UsersRepoCreateUserUseCase;
  let readByOneProperty: UsersRepoReadOneByPropertyValueUseCase;
  let readByFirstOrSecondPropertyUseCase: UsersRepoReadOneByLoginOrEmailUseCase;
  let clearUseCase: UsersRepoClearUseCase;

  beforeAll(async () => {
    module = await TestUsersRepoTestingModule.compile();

    await module.init();

    createUseCase = module.get<UsersRepoCreateUserUseCase>(
      UsersRepoCreateUserUseCase,
    );
    readByFirstOrSecondPropertyUseCase =
      module.get<UsersRepoReadOneByLoginOrEmailUseCase>(
        UsersRepoReadOneByLoginOrEmailUseCase,
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

    let findYserByOneProperty = new UsersRepoReadOneByPropertyValueCommand({
      propertyName: 'login',
      propertyValue: createCommand_1.message.login,
    });
    let findUserByLoginCommand = new UsersRepoReadOneByLoginOrEmailCommand(
      createCommand_1.message.login,
    );
    let findUserByEmailCommand = new UsersRepoReadOneByLoginOrEmailCommand(
      createCommand_1.message.email,
    );

    let clearDb = await clearUseCase.execute(clearCommand);

    let createUser_1 = await createUseCase.execute(createCommand_1);
    let createUser_2 = await createUseCase.execute(createCommand_2);
    let createUser_3 = await createUseCase.execute(createCommand_3);
    let createUser_4 = await createUseCase.execute(createCommand_4);

    let findUser = await readByOneProperty.execute(findYserByOneProperty);

    let findUserByLogin = await readByFirstOrSecondPropertyUseCase.execute(
      findUserByLoginCommand,
    );
    let findUseByEmail = await readByFirstOrSecondPropertyUseCase.execute(
      findUserByEmailCommand,
    );

    expect(findUser).toMatchObject(createUser_1);
    expect(findUserByLogin).toMatchObject(createUser_1);
    expect(findUseByEmail).toEqual(createUser_1);
  });
});
