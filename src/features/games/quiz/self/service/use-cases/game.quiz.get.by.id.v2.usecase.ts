import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GameQuizGetByIdCommand } from "./game.quiz.get.by.id.usecase";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { QuizGameInfo } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { DataSource, QueryRunner } from "typeorm";
import { GamesRepoEntity } from "../../repo/entities/GamesRepoEntity";
import { QuizQuestionEntity } from "../../../questions/repo/entity/QuestionsRepoEntity";
import { QuizGameAnswerInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameAnswerInfoEntity";
import { QuizGameAnswerRepoEntity } from "../../../answers/repo/entities/GamesAnswersRepoEntity";

@CommandHandler(GameQuizGetByIdCommand)
@Injectable()
export class GameQuizGetByIdV2UseCase implements ICommandHandler<GameQuizGetByIdCommand, QuizGameInfo> {
  constructor(private dataSource: DataSource) {}

  async execute(command: GameQuizGetByIdCommand): Promise<QuizGameInfo> {
    let result: QuizGameInfo;

    let game = await this.GetGame(command.gameId, this.dataSource);
    if (!game) throw new NotFoundException();

    if (game.player_1_id !== +command.userId && game.player_2_id !== +command.userId) throw new ForbiddenException();

    if (game.status === "PendingSecondPlayer")
      return QuizGameInfo.InitNewGame(command.gameId, command.userId, game.player_1.login, game.createdAt);

    let gameQuestions = await this.GetQuestions(command.gameId, this.dataSource);
    game.questionEntities = gameQuestions;

    let p1Answers = await this.GetUserAnswers(game.player_1_id, game.id, this.dataSource);
    let p2Answers = await this.GetUserAnswers(game.player_2_id, game.id, this.dataSource);

    return QuizGameInfo.Get(
      game,
      p1Answers.map(
        (a) =>
          new QuizGameAnswerInfoEntity(
            a.questionId.toString(),
            gameQuestions.find((gq) => gq.id === a.questionId).correctAnswers,
            a.answer,
            a.createdAt,
          ),
      ),
      p2Answers.map(
        (a) =>
          new QuizGameAnswerInfoEntity(
            a.questionId.toString(),
            gameQuestions.find((gq) => gq.id === a.questionId).correctAnswers,
            a.answer,
            a.createdAt,
          ),
      ),
    );
  }

  private async GetGame(gameId: string, ds: DataSource) {
    return ds.manager.findOne(GamesRepoEntity, {
      where: { id: +gameId },
      relations: { player_1: true, player_2: true },
    });
  }

  private async GetQuestions(gameId: string, ds: DataSource) {
    return (await ds.manager.query(`
        SELECT q.*
        FROM public."QuizQuestions" q
        LEFT JOIN public."QuizGameQuestion" qg
        ON q."id" = qg."questionId"
        WHERE qg."gameId" = ${gameId}
        ORDER BY qg."orderNum" ASC`)) as Array<QuizQuestionEntity>;
  }

  private async GetUserAnswers(userId: number, gameId: number, ds: DataSource) {
    return await ds.manager.find(QuizGameAnswerRepoEntity, { where: { gameId: gameId, userId: userId } });
  }
}
