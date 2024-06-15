import { GamesRepoEntity } from "../../../repo/entities/GamesRepoEntity";
import { QuizGameAnswerInfoEntity } from "./QuizGameAnswerInfoEntity";
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

  public static InitGame(game: GamesRepoEntity, questions: QuizGameQuestionInfoEntity[]) {
    return new QuizGameInfo(
      game.id.toString(),
      new QuizGamePlayerProgressEntity(
        [],
        new QuizGamePlayerInfoEntity(game.player_1.id.toString(), game.player_1.login),
        game.player_1_score,
      ),
      new QuizGamePlayerProgressEntity(
        [],
        new QuizGamePlayerInfoEntity(game.player_2.id.toString(), game.player_2.login),
        game.player_2_score,
      ),
      questions,
      game.status,
      game.createdAt,
      game.startedAt,
      game.endedAt,
    );
  }

  public static Get(game: GamesRepoEntity, p1a?: QuizGameAnswerInfoEntity[], p2a?: QuizGameAnswerInfoEntity[]) {
    if (game.player_2 && game.questionEntities.length > 0) {
      let res = this.InitGame(
        game,
        game.questionEntities.map((q) => new QuizGameQuestionInfoEntity(q.id.toString(), q.body)),
      );

      if (p1a && p2a) {
        res.firstPlayerProgress.answers = p1a;
        res.secondPlayerProgress.answers = p2a;
      }

      return res;
    }

    return this.InitNewGame(game.id.toString(), game.player_1_id.toString(), game.player_1.login, game.createdAt);
  }
}
