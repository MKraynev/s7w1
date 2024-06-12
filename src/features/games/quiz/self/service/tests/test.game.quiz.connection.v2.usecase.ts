import { TestingModule } from "@nestjs/testing";
import { GameQuizConnectionV2UseCase } from "../use-cases/game.quiz.connection.v2.usecase";
import { TestGameQuizModule } from "./settings/game.quiz.testing.module";
import { UsersRepoService } from "../../../../../users/repo/UsersRepoService";
import { UserControllerRegistrationEntity } from "../../../../../users/controllers/entities/UsersControllerRegistrationEntity";
import { QuizGameConnectToGameCommand } from "../use-cases/game.quiz.connection.usecase";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { Equal } from "typeorm";
import { arrayNotEmpty } from "class-validator";
import { QuizQuestionRepoService } from "../../../questions/repo/QuestionsRepoService";
import { QuizQuestionPostEntity } from "../../../questions/controllers/entities/QuestionsControllerPostEntity";

describe(`${GameQuizConnectionV2UseCase.name} test`, () => {
  let module: TestingModule;
  let userRepo: UsersRepoService;
  let gameRepo: GamesRepoService;
  let connectionUseCase: GameQuizConnectionV2UseCase;
  let questionRepo: QuizQuestionRepoService;

  beforeAll(async () => {
    module = await TestGameQuizModule.compile();

    await module.init();

    userRepo = module.get<UsersRepoService>(UsersRepoService);
    connectionUseCase = module.get<GameQuizConnectionV2UseCase>(GameQuizConnectionV2UseCase);
    gameRepo = module.get<GamesRepoService>(GamesRepoService);
    questionRepo = module.get<QuizQuestionRepoService>(QuizQuestionRepoService);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await userRepo.DeleteAll();
    await gameRepo.DeleteAll();
    await questionRepo.DeleteAll();
  });

  // it(
  //   `${GameQuizConnectionV2UseCase.name} init game`,
  //   async () => {
  //     let userData: UserControllerRegistrationEntity = {
  //       login: "login",
  //       email: "mail",
  //       password: "12345",
  //     };

  //     let user = await userRepo.Create(userData);
  //     let command = new QuizGameConnectToGameCommand(user.id.toString(), user.login);

  //     let useCaseResult = await connectionUseCase.execute(command);
  //     console.log(useCaseResult);

  //     let game = await gameRepo.GetUserCurrentGame(user.id.toString());
  //     expect(game).not.toBeNull();
  //   },
  //   1000 * 60 * 5, //5 min
  // );

  // it(
  //   `${GameQuizConnectionV2UseCase.name} return correct entity for first Player`,
  //   async () => {
  //     let userData: UserControllerRegistrationEntity = {
  //       login: "login2",
  //       email: "mail2",
  //       password: "123456",
  //     };

  //     let user = await userRepo.Create(userData);
  //     let command = new QuizGameConnectToGameCommand(user.id.toString(), user.login);

  //     let useCaseResult = await connectionUseCase.execute(command);

  //     expect(useCaseResult).toEqual({
  //       id: expect.any(String),
  //       firstPlayerProgress: { answers: [], player: { id: expect.any(String), login: userData.login }, score: 0 },
  //       pairCreatedDate: expect.any(Date),
  //       questions: null,
  //       secondPlayerProgress: null,
  //       startGameDate: null,
  //       finishGameDate: null,
  //       status: "PendingSecondPlayer",
  //     });
  //   },
  //   1000 * 60 * 5, //5 min
  // );

  it(
    `${GameQuizConnectionV2UseCase.name} return correct entity for second Player`,
    async () => {
      let userData_1: UserControllerRegistrationEntity = {
        login: "login3",
        email: "mail3",
        password: "123456",
      };

      let userData_2: UserControllerRegistrationEntity = {
        login: "login4",
        email: "mail4",
        password: "123456",
      };

      let q1 = await questionRepo.Create(new QuizQuestionPostEntity("q1", ["q1"]), true);
      let q2 = await questionRepo.Create(new QuizQuestionPostEntity("q2", ["q2"]), true);
      let q3 = await questionRepo.Create(new QuizQuestionPostEntity("q3", ["q3"]), true);
      let q4 = await questionRepo.Create(new QuizQuestionPostEntity("q4", ["q4"]), true);
      let q5 = await questionRepo.Create(new QuizQuestionPostEntity("q5", ["q5"]), true);

      let user_1 = await userRepo.Create(userData_1);
      let user_2 = await userRepo.Create(userData_2);

      let command_1 = new QuizGameConnectToGameCommand(user_1.id.toString(), user_1.login);
      let command_2 = new QuizGameConnectToGameCommand(user_2.id.toString(), user_2.login);

      let useCaseResult_1 = await connectionUseCase.execute(command_1);
      let useCaseResult_2 = await connectionUseCase.execute(command_2);

      expect(JSON.parse(JSON.stringify(useCaseResult_2))).toEqual({
        id: expect.any(String),
        firstPlayerProgress: { answers: [], player: { id: expect.any(String), login: userData_1.login }, score: 0 },
        pairCreatedDate: expect.any(String),
        questions: expect.any(Array<{ id: String; body: String }>),
        secondPlayerProgress: { answers: [], player: { id: expect.any(String), login: userData_2.login }, score: 0 },
        startGameDate: expect.any(String),
        finishGameDate: null,
        status: "Active",
      });
    },
    1000 * 60 * 5, //5 min
  );
});
