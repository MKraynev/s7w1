import { Injectable } from "@nestjs/common";
import { DataSource, LessThan, QueryRunner } from "typeorm";
import { QuizGameInfo } from "../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { GameQuizRules } from "../../rules/game.quiz.rules";
import { Interval } from "@nestjs/schedule";
import { GameQuizClosingGameEntity } from "../repo/entities/game.quiz.closing.game.entity";
import { GamesRepoEntity } from "../repo/entities/GamesRepoEntity";
import { GameQuizPlayerRepoEntity, QuizGameStatus } from "../../winners/repo/entity/game.quiz.winner.repo.entity";

@Injectable()
export class GameQuizCloseExpireGameEvent {
  constructor(private dataSource: DataSource) {}

  @Interval(1000)
  public async CloseExpiredGame() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let expiredGames = await this.FindExpiredGames(queryRunner);

      for (const eg of expiredGames) {
        this.CloseGame(eg.game);
        this.AddExtraScore(eg.game);
        await this.UpdatePlayersStats(eg.game, queryRunner);
        await queryRunner.manager.save(GamesRepoEntity, eg.game);
        await queryRunner.manager.delete(GameQuizClosingGameEntity, eg);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log("Closing game error:", e);
    } finally {
      await queryRunner.release();
    }
  }

  private async FindExpiredGames(qr: QueryRunner) {
    let expiredGameTime = Date.now() - 0.85 * GameQuizRules.SecondUserAnswerAvailableTime_ms();

    return await qr.manager.find(GameQuizClosingGameEntity, {
      where: { createdAt_milliseconds: LessThan(expiredGameTime) },
      relations: { game: true },
    });

    /*
{
    id: 4,
    gameId: 261,
    createdAt_milliseconds: '1718660961765',
    game: GamesRepoEntity {
      questionEntities: [],
      id: 261,
      player_1_id: 398,
      player_1_answerCount: 5,
      player_1_score: 5,
      player_2_id: 399,
      player_2_answerCount: 0,
      player_2_score: 0,
      status: 'Active',
      createdAt: 2024-06-17T21:49:17.700Z,
      startedAt: 2024-06-17T21:49:17.706Z,
      endedAt: null,
      updatedAt: 2024-06-17T21:49:21.759Z
    }
  }
*/
  }

  private AddExtraScore(game: GamesRepoEntity) {
    if (game.player_1_answerCount > game.player_2_answerCount) game.player_1_score++;
    else game.player_2_score++;
  }

  private CloseGame(game: GamesRepoEntity) {
    game.status = "Finished";
    game.endedAt = new Date();
  }

  private async UpdatePlayersStats(currentGame: GamesRepoEntity, qr: QueryRunner) {
    let p1_stats = await qr.manager.findOne(GameQuizPlayerRepoEntity, { where: { playerId: currentGame.player_1_id } });
    let p2_stats = await qr.manager.findOne(GameQuizPlayerRepoEntity, { where: { playerId: currentGame.player_2_id } });

    if (!p1_stats) p1_stats = GameQuizPlayerRepoEntity.Init(currentGame.player_1_id);
    if (!p2_stats) p2_stats = GameQuizPlayerRepoEntity.Init(currentGame.player_2_id);

    let p1_gameStatus: QuizGameStatus;
    let p2_gameStatus: QuizGameStatus;

    let scoreDiff = currentGame.player_1_score - currentGame.player_2_score;
    switch (scoreDiff) {
      case 0:
        p1_gameStatus = QuizGameStatus.draw;
        p2_gameStatus = QuizGameStatus.draw;
        break;

      default:
        if (scoreDiff > 0) {
          p1_gameStatus = QuizGameStatus.win;
          p2_gameStatus = QuizGameStatus.lose;
        } else {
          p1_gameStatus = QuizGameStatus.lose;
          p2_gameStatus = QuizGameStatus.win;
        }
    }

    p1_stats.AddScores(currentGame.player_1_score, p1_gameStatus);
    p2_stats.AddScores(currentGame.player_2_score, p2_gameStatus);

    await Promise.all([qr.manager.save(GameQuizPlayerRepoEntity, p1_stats), qr.manager.save(GameQuizPlayerRepoEntity, p2_stats)]);
  }
}

/*
game in db
1_718_733_713_010

user answered -> 8:01:53 PM

start: 6/18/2024, 8:01:54 PM
search less than: 1_718_733_701_782


event done: 6/18/2024, 8:01:57 PM
time ms: 1_718_733_704_785

                  707 -> 2:00
                  710 -> 2:03
                  713 -> 2:06
*/
