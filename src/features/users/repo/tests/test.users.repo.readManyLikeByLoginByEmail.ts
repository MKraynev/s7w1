import { TestingModule } from '@nestjs/testing';
import { UsersRepoService } from '../UsersRepoService';
import { TestUsersRepoTestingModule } from './settings/users.repo.testingModule';
import { UserControllerRegistrationEntity } from 'src/features/users/controllers/entities/UsersControllerRegistrationEntity';

describe(`UsersRepoService ReadLike`, () => {
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

  it('Create 3 like users, expext receive 3 users', async () => {
    await usersRepoService.DeleteAll();

    let user_1 = new UserControllerRegistrationEntity(
      'userLogin',
      'lk@mail.com',
      '123123',
    );
    let user_2 = new UserControllerRegistrationEntity(
      'userLog',
      'ba@mail.com',
      '123123',
    );
    let user_3 = new UserControllerRegistrationEntity(
      'userLogi',
      'qe@mail.com',
      '123123',
    );
    let user_4 = new UserControllerRegistrationEntity(
      'pupu',
      'zi@mail.com',
      '123123',
    );

    let createdUser_1 = await usersRepoService.Create(user_1);
    let createdUser_2 = await usersRepoService.Create(user_2);
    let createdUser_3 = await usersRepoService.Create(user_3);
    let createdUser_4 = await usersRepoService.Create(user_4);

    let users = await usersRepoService.ReadManyLikeByLoginByEmail(
      'user',
      undefined,
    );

    expect(users.countAll).toEqual(3);
    expect(users.foundusers).toEqual([
      createdUser_3,
      createdUser_2,
      createdUser_1,
    ]);
  });
});
