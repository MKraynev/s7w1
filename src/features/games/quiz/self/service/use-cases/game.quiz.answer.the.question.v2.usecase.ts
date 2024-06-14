import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { GameQuizAnswerTheQuestionCommand } from "./game.quiz.answer.the.question.usecase";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameAnswerResult } from "../entities/quiz.game.answer.result";
import { Brackets, DataSource, QueryRunner } from "typeorm";
import { GamesRepoEntity } from "../../repo/entities/GamesRepoEntity";
import { UserRepoEntity } from "../../../../../users/repo/entities/UsersRepoEntity";
import { QuizGameAnswerRepoEntity } from "../../../answers/repo/entities/GamesAnswersRepoEntity";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { GameQuizPlayerRepoEntity, QuizGameStatus } from "../../../winners/repo/entity/game.quiz.winner.repo.entity";

@Injectable()
@CommandHandler(GameQuizAnswerTheQuestionCommand)
export class GameQuizAnswerTheQuestionV2UseCase implements ICommandHandler<GameQuizAnswerTheQuestionCommand, QuizGameAnswerResult> {
  constructor(private dataSource: DataSource) {}
  async execute(command: GameQuizAnswerTheQuestionCommand): Promise<QuizGameAnswerResult> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let result: QuizGameAnswerResult;

    try {
      let { userNotExist, user } = await this.FindUser(command.userId, queryRunner);
      if (userNotExist) throw new UnauthorizedException();

      let currentGame = await this.FindUserCurrentGame(command.userId, queryRunner);
      if (!currentGame || currentGame.status !== "Active") {
        throw new ForbiddenException();
      }

      let gameQuestions = await this.GameQuestions(currentGame.id, queryRunner);

      let userAlreadyAnswered = currentGame.player_1_id === user.id ? currentGame.player_1_answerCount : currentGame.player_2_answerCount;

      if (gameQuestions.length === userAlreadyAnswered) {
        throw new ForbiddenException(); //player answered all questions
      }

      let currentQuestion = gameQuestions[userAlreadyAnswered]; //newPos = count

      //save answer
      let savedAnswer = await queryRunner.manager.save(
        QuizGameAnswerRepoEntity,
        QuizGameAnswerRepoEntity.Init(currentGame.id, currentQuestion.id, user.id, command.answer),
      );

      //add answer scores
      this.AddScores(currentGame, user.id, command.answer, currentQuestion.correctAnswers);

      if (this.PlayersAnsweredAllQuesitons(currentGame)) {
        this.CloseGame(currentGame);
        await this.AddExtraPoints(currentGame, queryRunner);
        await this.UpdatePlayersStats(currentGame, queryRunner);
      }

      //from Russia with love, Mr. Bond
      let currentPlayerAnswerAllQuestionsAndSecondOneDidnt =
        userAlreadyAnswered + 1 === gameQuestions.length &&
        currentGame.player_1_answerCount + currentGame.player_2_answerCount < gameQuestions.length * 2;

      if (currentPlayerAnswerAllQuestionsAndSecondOneDidnt) this.CloseGameAfterExpiredTime(command.userId);

      //update game stats
      await queryRunner.manager.save(GamesRepoEntity, currentGame);

      await queryRunner.commitTransaction();

      //set result data
      result = new QuizGameAnswerResult(
        currentQuestion.id.toString(),
        currentQuestion.correctAnswers.includes(command.answer) ? "Correct" : "Incorrect",
        savedAnswer.createdAt,
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();

      console.log(err);

      throw new ForbiddenException();
    } finally {
      await queryRunner.release();
    }

    return result;
  }

  private async FindUser(userId: string, qr: QueryRunner): Promise<{ userNotExist: boolean; user: UserRepoEntity }> {
    let user = await qr.manager.findOne(UserRepoEntity, { where: { id: +userId } });

    return {
      userNotExist: user ? false : true,
      user: user,
    };
  }

  private async FindUserCurrentGame(userId: string, qr: QueryRunner) {
    let gameInfo = await qr.manager
      .createQueryBuilder()
      .from(GamesRepoEntity, "g")
      .select("g")
      .where(
        new Brackets((qb) => {
          qb.where("g.status = :active", { active: "Active" }).orWhere("g.status = :pending", { pending: "PendingSecondPlayer" });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where("g.player_1_id = :id", { id: userId }).orWhere("g.player_2_id = :id", { id: userId });
        }),
      )
      .getOne();

    return gameInfo;
  }

  private async GameQuestions(gameId: number, qr: QueryRunner) {
    return (await qr.manager.query(`
        SELECT q."id", q."body", q."correctAnswers"
        FROM public."QuizQuestions" q
        LEFT JOIN public."QuizGameQuestion" qg
        ON q."id" = qg."questionId"
        WHERE qg."gameId" = ${gameId}
        ORDER BY qg."orderNum" ASC`)) as Array<{ id: number; body: string; correctAnswers: Array<string> }>;
  }

  private AddScores(currentGame: GamesRepoEntity, userId: number, userAnswer: string, correctAnswer: string[]) {
    if (currentGame.player_1_id === userId) {
      currentGame.player_1_score += GameQuizRules.ConvertAnswersToScores(userAnswer, correctAnswer);
      currentGame.player_1_answerCount += 1;
    } else if (currentGame.player_2_id === userId) {
      currentGame.player_2_score += GameQuizRules.ConvertAnswersToScores(userAnswer, correctAnswer);
      currentGame.player_2_answerCount += 1;
    }
  }

  private PlayersAnsweredAllQuesitons(game: GamesRepoEntity) {
    return game.player_1_answerCount === GamesRepoEntity.QuestionCount() && game.player_2_answerCount === GamesRepoEntity.QuestionCount();
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

  private async AddExtraPoints(game: GamesRepoEntity, qr: QueryRunner) {
    let p1_lastAnswers = await qr.manager.find(QuizGameAnswerRepoEntity, {
      where: { gameId: game.id, userId: game.player_1_id },
      order: { createdAt: "DESC" },
      take: 1,
    });

    let p2_lastAnswers = await qr.manager.find(QuizGameAnswerRepoEntity, {
      where: { gameId: game.id, userId: game.player_2_id },
      order: { createdAt: "DESC" },
      take: 1,
    });

    if (+new Date(p1_lastAnswers[0].createdAt) < +new Date(p2_lastAnswers[0].createdAt) && game.player_1_score > 0)
      game.player_1_score += 1;
    else if (+new Date(p2_lastAnswers[0].createdAt) < +new Date(p1_lastAnswers[0].createdAt) && game.player_2_score > 0)
      game.player_2_score += 1;
  }

  private async EndGameByFinishedUser(finishedUserId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      let currentGame = await this.FindUserCurrentGame(finishedUserId, queryRunner);

      if (!currentGame || currentGame.status !== "Active") {
        return;
      }

      let gameQuestions = await this.GameQuestions(currentGame.id, queryRunner);

      let secondPlayer: { id: number; answeredQuestionCount: number };
      if (+finishedUserId === currentGame.player_1_id) {
        secondPlayer = {
          id: currentGame.player_2_id,
          answeredQuestionCount: currentGame.player_2_answerCount,
        };

        currentGame.player_2_answerCount = gameQuestions.length;
      } else {
        secondPlayer = {
          id: currentGame.player_1_id,
          answeredQuestionCount: currentGame.player_1_answerCount,
        };

        currentGame.player_1_answerCount = gameQuestions.length;
      }

      //Ответить за пользователя
      await Promise.all(
        gameQuestions.map(async (q, qpos) => {
          if (qpos >= secondPlayer.answeredQuestionCount) {
            return queryRunner.manager.save(
              QuizGameAnswerRepoEntity,
              QuizGameAnswerRepoEntity.Init(currentGame.id, q.id, secondPlayer.id, null),
            );
          }
        }),
      );

      this.CloseGame(currentGame);
      await this.AddExtraPoints(currentGame, queryRunner);
      await this.UpdatePlayersStats(currentGame, queryRunner);

      //update game stats
      await queryRunner.manager.save(GamesRepoEntity, currentGame);

      await queryRunner.commitTransaction();
    } catch (e) {
    } finally {
      await queryRunner.release();
    }
  }

  private async CloseGameAfterExpiredTime(userId) {
    setTimeout(() => {
      this.EndGameByFinishedUser(userId);
    }, GameQuizRules.SecondUserAnswerAvailableTime_ms());
  }
}
