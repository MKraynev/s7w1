import { TestingModule } from '@nestjs/testing';
import { UsersRepoService } from '../UsersRepoService';
import { TestUsersRepoTestingModule } from './settings/users.repo.testingModule';
import { UserControllerRegistrationEntity } from '../../controllers/entities/UsersControllerRegistrationEntity';

describe(`${UsersRepoService.name}: read user`, () => {
  let module: TestingModule;

  let usersRepoService: UsersRepoService;

  beforeAll(async () => {
    module = await TestUsersRepoTestingModule.compile();

    await module.init();

    usersRepoService = module.get<UsersRepoService>(UsersRepoService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Get user by login', async () => {
    let createUserEntity_1 = new UserControllerRegistrationEntity(
      'userqwe',
      'special@mail.com',
      '123123',
    );
    let createUserEntity_2 = new UserControllerRegistrationEntity(
      'user',
      'notspecial@mail.com',
      '123123',
    );
    let createUserEntity_3 = new UserControllerRegistrationEntity(
      'bob',
      'bob@mail.com',
      '123123',
    );
    let createUserEntity_4 = new UserControllerRegistrationEntity(
      'alice',
      'alice@mail.com',
      '123123',
    );

    let deleteAll = await usersRepoService.DeleteAll();

    let createUser_1 = await usersRepoService.Create(createUserEntity_1);
    let createUser_2 = await usersRepoService.Create(createUserEntity_2);
    let createUser_3 = await usersRepoService.Create(createUserEntity_3);
    let createUser_4 = await usersRepoService.Create(createUserEntity_4);

    let findUsersByLoginByEmail =
      await usersRepoService.ReadManyCertainByLoginByEmail(
        createUser_2.login,
        createUser_3.email,
      );

    expect(findUsersByLoginByEmail).toMatchObject([createUser_2, createUser_3]);
  });
});
