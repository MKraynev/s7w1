import { TestingModule } from '@nestjs/testing';
import { PostServiceGetManyUseCase } from '../use-cases/PostServiceGetPostsManyUsecase';

describe(`${PostServiceGetManyUseCase.name} test`, () => {
  // let module: TestingModule;

  // let usersRepo: UsersRepoService;
  // let deviceRepo: DeviceRepoService;
  // let loginUseCase: UsersServiceLoginUseCase;
  // let refreshUseCase: UsersSerivceRefreshTokenUseCase;
  // let jwtHandleService: JwtHandlerService;

  // beforeAll(async () => {
  //   module = await TestUsersServiceTestingModule.compile();

  //   await module.init();
  //   //TODO доделать тест переписывающий цепочку запросов на один sql
  //   usersRepo = module.get<UsersRepoService>(UsersRepoService);
  //   deviceRepo = module.get<DeviceRepoService>(DeviceRepoService);
  //   loginUseCase = module.get<UsersServiceLoginUseCase>(UsersServiceLoginUseCase);
  //   refreshUseCase = module.get<UsersSerivceRefreshTokenUseCase>(UsersSerivceRefreshTokenUseCase);
  //   jwtHandleService = module.get<JwtHandlerService>(JwtHandlerService);
  // });

  // afterAll(async () => {
  //   await module.close();
  // });
  it('Works with sqlRaw', () => {});
});
