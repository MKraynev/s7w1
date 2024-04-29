import { TestingModule } from '@nestjs/testing';
import { TestUsersServiceTestingModule } from './settings/ users.controller.testingModule';
import { UsersRepoService } from '../../repo/UsersRepoService';
import { UsersController } from '../UsersController';
import { UserControllerRegistrationEntity } from '../entities/UsersControllerRegistrationEntity';

describe(`${UsersController.name} test`, () => {
  let module: TestingModule;
  let usersRepo: UsersRepoService;
  let usersController: UsersController;

  beforeAll(async () => {
    module = await TestUsersServiceTestingModule.compile();

    await module.init();

    usersRepo = module.get<UsersRepoService>(UsersRepoService);
    usersController = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await module.close();
  });

  it(`Delete exist user by id`, async () => {
    await usersRepo.DeleteAll();

    let user = new UserControllerRegistrationEntity(
      'userLogin',
      'user@mail.com',
      '123123',
    );
    let { password, ...rest } = user;

    let savedUser = await usersController.SaveUser(user);

    expect(savedUser).toMatchObject(rest);

    let deletedUser = await usersController.DeleteUser(savedUser.id.toString());

    let findUser = await usersRepo.ReadOneFullyByLoginOrEmail(user.login);

    expect(findUser).toEqual(null);
  });
});
