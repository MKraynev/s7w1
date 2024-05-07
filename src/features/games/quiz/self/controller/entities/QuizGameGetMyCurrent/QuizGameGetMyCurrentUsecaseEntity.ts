import { GamesRepoEntity } from "../../../repo/entities/GamesRepoEntity";
import { QuizGamePlayerInfoEntity } from "./QuizGamePlayerInfoEntity";
import { QuizGamePlayerProgressEntity } from "./QuizGamePlayerProgressEntity";
import { QuizGameQuestionInfoEntity } from "./QuizGameQuestionInfoEntity";
import { QuizGameStatus } from "./QuizGameStatusEnum";

export class QuizGameInfo {
  constructor(
    public id: string,
    public firstPlayerProgress: QuizGamePlayerProgressEntity,
    public secondPlayerProgress: QuizGamePlayerProgressEntity,
    public questions: QuizGameQuestionInfoEntity[],
    public status: QuizGameStatus,
    public pairCreatedDate: Date,
    public startGameDate: Date,
    public finishGameDate: Date,
  ) {}

  public static InitNewGame(gameId: string, userId: string, userLogin: string, gameCreatedAt: Date) {
    let res = new QuizGameInfo(
      gameId,
      new QuizGamePlayerProgressEntity([], new QuizGamePlayerInfoEntity(userId, userLogin), 0),
      null,
      null,
      "PendingSecondPlayer",
      gameCreatedAt,
      null,
      null,
    );

    return res;
  }

  public static InitGame(game: GamesRepoEntity) {
    return new QuizGameInfo(
      game.id.toString(),
      new QuizGamePlayerProgressEntity([], new QuizGamePlayerInfoEntity(game.player_1.id.toString(), game.player_1.login), 0),
      new QuizGamePlayerProgressEntity([], new QuizGamePlayerInfoEntity(game.player_2.id.toString(), game.player_2.login), 0),
      [],
      game.status,
      game.createdAt,
      game.startedAt,
      null,
    );
  }
}