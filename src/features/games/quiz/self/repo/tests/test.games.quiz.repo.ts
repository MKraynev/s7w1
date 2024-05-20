import { TestingModule } from "@nestjs/testing";
import { UsersRepoService } from "../../../../../users/repo/UsersRepoService";
import { GamesRepoService } from "../GamesRepoService";
import { TestGameQuizRepoTestingModule } from "./settings/games.quiz.repo.testingModule";
import { UserControllerRegistrationEntity } from "../../../../../users/controllers/entities/UsersControllerRegistrationEntity";

describe("GamesQuizRepo tests", () => {
  let module: TestingModule;

  let gameRepo: GamesRepoService;
  let userRepo: UsersRepoService;

  beforeAll(async () => {
    module = await TestGameQuizRepoTestingModule.compile();

    await module.init();

    gameRepo = module.get<GamesRepoService>(GamesRepoService);
    userRepo = module.get<UsersRepoService>(UsersRepoService);
  });

  afterAll(async () => {
    await module.close();
  });

  it("Get user win count", async () => {
    await gameRepo.DeleteAll();
    await userRepo.DeleteAll();

    let user_1 = await userRepo.Create(new UserControllerRegistrationEntity("user_1_login", "mail1@a.com", "12345"), true);
    let user_2 = await userRepo.Create(new UserControllerRegistrationEntity("user_2_login", "mail2@a.com", "12345"), true);

    let game_1 = await gameRepo.CreateGame(user_1.id);
    game_1.player_2_id = user_2.id;
    game_1.status = "Finished";

    game_1.player_1_score = 23;
    game_1.player_2_score = 5;

    let game_3 = await gameRepo.CreateGame(user_1.id);
    game_3.player_2_id = user_2.id;
    game_3.status = "Finished";

    game_3.player_1_score = 12;
    game_3.player_2_score = 4;

    let game_2 = await gameRepo.CreateGame(user_1.id);
    game_2.player_2_id = user_2.id;
    game_2.status = "Finished";

    game_2.player_1_score = 0;
    game_2.player_2_score = 5;

    await gameRepo.Save(game_1);
    await gameRepo.Save(game_2);
    await gameRepo.Save(game_3);

    let p1winsCount = await gameRepo.CountPlayerWinGames(user_1.id.toString());
    let p2winsCount = await gameRepo.CountPlayerWinGames(user_2.id.toString());

    expect(p1winsCount).toEqual(2);
    expect(p2winsCount).toEqual(1);
  });

  it("Get user lose count", async () => {
    await gameRepo.DeleteAll();
    await userRepo.DeleteAll();

    let user_1 = await userRepo.Create(new UserControllerRegistrationEntity("user_1_login", "mail1@a.com", "12345"), true);
    let user_2 = await userRepo.Create(new UserControllerRegistrationEntity("user_2_login", "mail2@a.com", "12345"), true);

    let game_1 = await gameRepo.CreateGame(user_1.id);
    game_1.player_2_id = user_2.id;
    game_1.status = "Finished";

    game_1.player_1_score = 23;
    game_1.player_2_score = 5;

    let game_3 = await gameRepo.CreateGame(user_1.id);
    game_3.player_2_id = user_2.id;
    game_3.status = "Finished";

    game_3.player_1_score = 12;
    game_3.player_2_score = 4;

    let game_2 = await gameRepo.CreateGame(user_1.id);
    game_2.player_2_id = user_2.id;
    game_2.status = "Finished";

    game_2.player_1_score = 0;
    game_2.player_2_score = 5;

    await gameRepo.Save(game_1);
    await gameRepo.Save(game_2);
    await gameRepo.Save(game_3);

    let p1loseCount = await gameRepo.CountPlayerLoseGames(user_1.id.toString());
    let p2loseCount = await gameRepo.CountPlayerLoseGames(user_2.id.toString());

    expect(p1loseCount).toEqual(1);
    expect(p2loseCount).toEqual(2);
  });

  it("Get user draw count", async () => {
    await gameRepo.DeleteAll();
    await userRepo.DeleteAll();

    let user_1 = await userRepo.Create(new UserControllerRegistrationEntity("user_1_login", "mail1@a.com", "12345"), true);
    let user_2 = await userRepo.Create(new UserControllerRegistrationEntity("user_2_login", "mail2@a.com", "12345"), true);

    let game_1 = await gameRepo.CreateGame(user_1.id);
    game_1.player_2_id = user_2.id;
    game_1.status = "Finished";

    game_1.player_1_score = 23;
    game_1.player_2_score = 5;

    let game_3 = await gameRepo.CreateGame(user_1.id);
    game_3.player_2_id = user_2.id;
    game_3.status = "Finished";

    game_3.player_1_score = 4;
    game_3.player_2_score = 4;

    let game_2 = await gameRepo.CreateGame(user_1.id);
    game_2.player_2_id = user_2.id;
    game_2.status = "Finished";

    game_2.player_1_score = 5;
    game_2.player_2_score = 5;

    await gameRepo.Save(game_1);
    await gameRepo.Save(game_2);
    await gameRepo.Save(game_3);

    let p1drawCount = await gameRepo.CountPlayerDrawGames(user_1.id.toString());
    let p2drawCount = await gameRepo.CountPlayerDrawGames(user_2.id.toString());

    expect(p1drawCount).toEqual(2);
    expect(p2drawCount).toEqual(2);
  });

  it("Get user games count", async () => {
    await gameRepo.DeleteAll();
    await userRepo.DeleteAll();

    let user_1 = await userRepo.Create(new UserControllerRegistrationEntity("user_1_login", "mail1@a.com", "12345"), true);
    let user_2 = await userRepo.Create(new UserControllerRegistrationEntity("user_2_login", "mail2@a.com", "12345"), true);

    let game_1 = await gameRepo.CreateGame(user_1.id);
    game_1.player_2_id = user_2.id;
    game_1.status = "Finished";

    game_1.player_1_score = 23;
    game_1.player_2_score = 5;

    let game_3 = await gameRepo.CreateGame(user_1.id);
    game_3.player_2_id = user_2.id;
    game_3.status = "Finished";

    game_3.player_1_score = 4;
    game_3.player_2_score = 4;

    let game_2 = await gameRepo.CreateGame(user_1.id);
    game_2.player_2_id = user_2.id;
    game_2.status = "Finished";

    game_2.player_1_score = 5;
    game_2.player_2_score = 5;

    await gameRepo.Save(game_1);
    await gameRepo.Save(game_2);
    await gameRepo.Save(game_3);

    let p1Count = await gameRepo.CountPlayerGames(user_1.id.toString());
    let p2Count = await gameRepo.CountPlayerGames(user_2.id.toString());

    expect(p1Count).toEqual(3);
    expect(p2Count).toEqual(3);
  });

  it("Get user scores", async () => {
    await gameRepo.DeleteAll();
    await userRepo.DeleteAll();

    let user_1 = await userRepo.Create(new UserControllerRegistrationEntity("user_1_login", "mail1@a.com", "12345"), true);
    let user_2 = await userRepo.Create(new UserControllerRegistrationEntity("user_2_login", "mail2@a.com", "12345"), true);

    let game_1 = await gameRepo.CreateGame(user_1.id);
    game_1.player_2_id = user_2.id;
    game_1.status = "Finished";

    game_1.player_1_score = 23;
    game_1.player_2_score = 5;

    let game_3 = await gameRepo.CreateGame(user_1.id);
    game_3.player_2_id = user_2.id;
    game_3.status = "Finished";

    game_3.player_1_score = 4;
    game_3.player_2_score = 4;

    let game_2 = await gameRepo.CreateGame(user_1.id);
    game_2.player_2_id = user_2.id;
    game_2.status = "Finished";

    game_2.player_1_score = 5;
    game_2.player_2_score = 5;

    await gameRepo.Save(game_1);
    await gameRepo.Save(game_2);
    await gameRepo.Save(game_3);

    let p1scores = await gameRepo.GetUserAllScores(user_1.id.toString());
    let p2scores = await gameRepo.GetUserAllScores(user_2.id.toString());

    expect(p1scores).toEqual(32);
    expect(p2scores).toEqual(14);
  });
});
