import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameConnectToGameCommand } from "./game.quiz.connection.usecase";
import { QuizGameInfo } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { DataSource, Not, QueryRunner } from "typeorm";
import { GamesRepoEntity } from "../../repo/entities/GamesRepoEntity";
import { GameQuizPlayerRepoEntity } from "../../../winners/repo/entity/game.quiz.winner.repo.entity";
import { QuizQuestionEntity } from "../../../questions/repo/entity/QuestionsRepoEntity";
import { GameQuizQuestionsInGameRepoEntity } from "../../../questions.in.game/repo/entity/game.quiz.questions.in.game.repo.entity";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { UserRepoEntity } from "../../../../../users/repo/entities/UsersRepoEntity";
import { use } from "passport";

@CommandHandler(QuizGameConnectToGameCommand)
@Injectable()
export class GameQuizConnectionV2UseCase implements ICommandHandler<QuizGameConnectToGameCommand, QuizGameInfo> {
  constructor(private dataSource: DataSource) {}
  async execute(command: QuizGameConnectToGameCommand): Promise<QuizGameInfo> {
    const queryRunner = this.dataSource.createQueryRunner();
    let savedGame: GamesRepoEntity;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let { userNotExist, user } = await this.FindUser(command.userId, queryRunner);
      if (userNotExist) throw new UnauthorizedException();

      let availableGame = await this.FindAvailableGame(command.userId, queryRunner);
      this.AddPlayerToGame(availableGame, user);

      if (GameQuizRules.AllPlayersAreReady(availableGame)) {
        this.UpdateGameStatus(availableGame);
        this.SetStartGameField(availableGame);
        await this.AddQuestionsToGame(availableGame, queryRunner);
      }

      savedGame = await queryRunner.manager.save(GamesRepoEntity, availableGame);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      console.log(err);

      throw err;
    } finally {
      await queryRunner.release();
    }

    return QuizGameInfo.Get(savedGame);
  }

  private SetStartGameField(availableGame: GamesRepoEntity) {
    availableGame.startedAt = new Date();
  }

  private async FindUser(userId: string, qr: QueryRunner): Promise<{ userNotExist: boolean; user: UserRepoEntity }> {
    let user = await qr.manager.findOne(UserRepoEntity, { where: { id: +userId } });

    return {
      userNotExist: user ? false : true,
      user: user,
    };
  }

  private async FindAvailableGame(exceptuserId: string, qr: QueryRunner): Promise<GamesRepoEntity> {
    let searchingGame = await qr.manager.findOne(GamesRepoEntity, {
      where: { status: "PendingSecondPlayer", player_1_id: Not(+exceptuserId) },
      relations: {
        player_1: true,
        player_2: true,
        questions: true,
      },
    });

    if (!searchingGame) searchingGame = GamesRepoEntity.Init(0, false);

    return searchingGame;
  }

  private AddPlayerToGame(game: GamesRepoEntity, player: UserRepoEntity) {
    if (game.player_1) {
      game.player_2 = player;
      game.player_2_id = player.id;
      game.player_2_score = 0;
      game.player_2_answerCount = 0;
    } else {
      game.player_1 = player;
      game.player_1_id = player.id;
      game.player_1_score = 0;
      game.player_1_answerCount = 0;
    }
  }

  private UpdateGameStatus(game: GamesRepoEntity) {
    switch (game.status) {
      case "PendingSecondPlayer":
        game.status = "Active";
        break;

      case "Active":
        game.status = "Finished";
        break;
    }
  }

  private async AddQuestionsToGame(game: GamesRepoEntity, qr: QueryRunner) {
    let questions = await qr.manager
      .createQueryBuilder()
      .select("qqe")
      .from(QuizQuestionEntity, "qqe")
      .orderBy("RANDOM()")
      .limit(GamesRepoEntity.QuestionCount())
      .getMany();

    questions.forEach(
      async (q, pos) =>
        await qr.manager.save(
          GameQuizQuestionsInGameRepoEntity,
          GameQuizQuestionsInGameRepoEntity.Init(game.id.toString(), q.id.toString(), pos),
        ),
    );
    game.questionEntities = questions;
  }
}
