import { TestingModule } from "@nestjs/testing";
import { GameQuizConnectionV2UseCase } from "../use-cases/game.quiz.connection.v2.usecase";
import { TestGameQuizModule } from "./settings/game.quiz.testing.module";
import { UsersRepoService } from "../../../../../users/repo/UsersRepoService";
import { UserControllerRegistrationEntity } from "../../../../../users/controllers/entities/UsersControllerRegistrationEntity";
import { QuizGameConnectToGameCommand } from "../use-cases/game.quiz.connection.usecase";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { DataSource, Equal } from "typeorm";
import { arrayNotEmpty } from "class-validator";
import { QuizQuestionRepoService } from "../../../questions/repo/QuestionsRepoService";
import { QuizQuestionPostEntity } from "../../../questions/controllers/entities/QuestionsControllerPostEntity";
import { GameQuizAnswerTheQuestionV2UseCase } from "../use-cases/game.quiz.answer.the.question.v2.usecase";
import { GameQuizAnswerTheQuestionCommand } from "../use-cases/game.quiz.answer.the.question.usecase";
import { GameQuizGetByIdCommand } from "../use-cases/game.quiz.get.by.id.usecase";
import { QuizGameAnswerRepoEntity } from "../../../answers/repo/entities/GamesAnswersRepoEntity";
import { GameQuizAnswersRepoService } from "../../../answers/repo/game.quiz.answers.repo.service";
import { GameQuizGetByIdV2UseCase } from "../use-cases/game.quiz.get.by.id.v2.usecase";
import { GameQuizClosingGameEntity } from "../../repo/entities/game.quiz.closing.game.entity";
import { GameQuizCloseExpireGameEvent } from "../../events/game.quiz.close.expire.game.event";

describe(`${GameQuizConnectionV2UseCase.name} test`, () => {
  let module: TestingModule;
  let userRepo: UsersRepoService;
  let gameRepo: GamesRepoService;
  let connectionUseCase: GameQuizConnectionV2UseCase;
  let answerUseCase: GameQuizAnswerTheQuestionV2UseCase;
  let getGameByIdUseCase: GameQuizGetByIdV2UseCase;
  let questionRepo: QuizQuestionRepoService;
  let answerRepo: GameQuizAnswersRepoService;
  let dataSource: DataSource;
  let event: GameQuizCloseExpireGameEvent;

  beforeAll(async () => {
    module = await TestGameQuizModule.compile();

    await module.init();

    userRepo = module.get<UsersRepoService>(UsersRepoService);
    connectionUseCase = module.get<GameQuizConnectionV2UseCase>(GameQuizConnectionV2UseCase);
    answerUseCase = module.get<GameQuizAnswerTheQuestionV2UseCase>(GameQuizAnswerTheQuestionV2UseCase);
    getGameByIdUseCase = module.get<GameQuizGetByIdV2UseCase>(GameQuizGetByIdV2UseCase);
    gameRepo = module.get<GamesRepoService>(GamesRepoService);
    questionRepo = module.get<QuizQuestionRepoService>(QuizQuestionRepoService);
    answerRepo = module.get<GameQuizAnswersRepoService>(GameQuizAnswersRepoService);
    dataSource = module.get<DataSource>(DataSource);
    event = module.get<GameQuizCloseExpireGameEvent>(GameQuizCloseExpireGameEvent);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await dataSource.manager.delete(GameQuizClosingGameEntity, {});
    await answerRepo.DeleteAll();
    await questionRepo.DeleteAll();
    await gameRepo.DeleteAll();
    await userRepo.DeleteAll();
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

  // it(
  //   `${GameQuizConnectionV2UseCase.name} return correct entity for second Player`,
  //   async () => {
  //     let userData_1: UserControllerRegistrationEntity = {
  //       login: "login3",
  //       email: "mail3",
  //       password: "123456",
  //     };

  //     let userData_2: UserControllerRegistrationEntity = {
  //       login: "login4",
  //       email: "mail4",
  //       password: "123456",
  //     };

  //     let q1 = await questionRepo.Create(new QuizQuestionPostEntity("q1", ["q1"]), true);
  //     let q2 = await questionRepo.Create(new QuizQuestionPostEntity("q2", ["q2"]), true);
  //     let q3 = await questionRepo.Create(new QuizQuestionPostEntity("q3", ["q3"]), true);
  //     let q4 = await questionRepo.Create(new QuizQuestionPostEntity("q4", ["q4"]), true);
  //     let q5 = await questionRepo.Create(new QuizQuestionPostEntity("q5", ["q5"]), true);

  //     let user_1 = await userRepo.Create(userData_1);
  //     let user_2 = await userRepo.Create(userData_2);

  //     let command_1 = new QuizGameConnectToGameCommand(user_1.id.toString(), user_1.login);
  //     let command_2 = new QuizGameConnectToGameCommand(user_2.id.toString(), user_2.login);

  //     let useCaseResult_1 = await connectionUseCase.execute(command_1);
  //     let useCaseResult_2 = await connectionUseCase.execute(command_2);

  //     expect(JSON.parse(JSON.stringify(useCaseResult_2))).toEqual({
  //       id: expect.any(String),
  //       firstPlayerProgress: { answers: [], player: { id: expect.any(String), login: userData_1.login }, score: 0 },
  //       pairCreatedDate: expect.any(String),
  //       questions: expect.any(Array<{ id: String; body: String }>),
  //       secondPlayerProgress: { answers: [], player: { id: expect.any(String), login: userData_2.login }, score: 0 },
  //       startGameDate: expect.any(String),
  //       finishGameDate: null,
  //       status: "Active",
  //     });
  //   },
  //   1000 * 60 * 5, //5 min
  // );

  it(
    `${GameQuizConnectionV2UseCase.name} finished game after 10 sec`,
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

      await answerUseCase.execute(
        new GameQuizAnswerTheQuestionCommand(user_1.id.toString(), user_1.login, useCaseResult_2.questions[0].body),
      );
      await new Promise((r) => setTimeout(r, 1000));

      let a2 = await answerUseCase.execute(
        new GameQuizAnswerTheQuestionCommand(user_1.id.toString(), user_1.login, useCaseResult_2.questions[1].body),
      );
      await new Promise((r) => setTimeout(r, 1000));
      let a3 = await answerUseCase.execute(
        new GameQuizAnswerTheQuestionCommand(user_1.id.toString(), user_1.login, useCaseResult_2.questions[2].body),
      );
      await new Promise((r) => setTimeout(r, 1000));
      let a4 = await answerUseCase.execute(
        new GameQuizAnswerTheQuestionCommand(user_1.id.toString(), user_1.login, useCaseResult_2.questions[3].body),
      );
      await new Promise((r) => setTimeout(r, 1000));
      let a5 = await answerUseCase.execute(
        new GameQuizAnswerTheQuestionCommand(user_1.id.toString(), user_1.login, useCaseResult_2.questions[4].body),
      );
      console.log("user answered:", new Date().toLocaleString());
      await new Promise((r) => setTimeout(r, 10000));

      let gameInfo = await getGameByIdUseCase.execute(new GameQuizGetByIdCommand(useCaseResult_1.id.toString(), user_1.id.toString()));

      // console.log("gameInfo", JSON.parse(JSON.stringify(gameInfo)));
      console.log("gameInfo", JSON.stringify(gameInfo));

      expect(gameInfo.status).toEqual("Finished");
    },
    1000 * 60 * 5, //5 min
  );
});
