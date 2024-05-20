import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtServiceUserAccessTokenLoad } from "../../../../../../jwt/entities/JwtServiceAccessTokenLoad";
import { QuizGameInfo } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";
import { UsersRepoService } from "../../../../../users/repo/UsersRepoService";
import { GamesRepoEntity } from "../../repo/entities/GamesRepoEntity";
import { QuizGameQuestionsExtendedInfoEntity } from "../../repo/entities/QuizGameQuestionsExtendedInfoEntity";
import { QuizGamePlayerProgressEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGamePlayerProgressEntity";
import { QuizGamePlayerInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGamePlayerInfoEntity";
import { QuizGameQuestionInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameQuestionInfoEntity";
import { Injectable } from "@nestjs/common";

export class GameQuizGetPairsMyCommand {
  constructor(
    public userToken: JwtServiceUserAccessTokenLoad,
    public paginator: { sortBy: keyof GamesRepoEntity; sortDirection: "desc" | "asc"; skip: number; limit: number },
  ) {}
}

@Injectable()
@CommandHandler(GameQuizGetPairsMyCommand)
export class GameQuizGetPairsMyUseCase implements ICommandHandler<GameQuizGetPairsMyCommand, { count: number; games: QuizGameInfo[] }> {
  constructor(
    private gamesRepo: GamesRepoService,
    private questionsInGameRepo: GameQuizQuestionsInGameService,
    private userRepo: UsersRepoService,
  ) {}
  async execute(command: GameQuizGetPairsMyCommand): Promise<{ count: number; games: QuizGameInfo[] }> {
    let countAndGames = await this.gamesRepo.CountAndReadManyByUserId(
      command.userToken.id,
      command.paginator.sortBy,
      command.paginator.sortDirection,
      command.paginator.skip,
      command.paginator.limit,
    );

    let result = await Promise.all(
      countAndGames.games.map(async (game) => {
        if (game.status == "PendingSecondPlayer") return await this.PendingSecondPlayerScenario(game);

        let usersInfo = await this.userRepo.GetIdLogin(game.player_1_id, game.player_2_id);
        let answersInfo: QuizGameQuestionsExtendedInfoEntity[] = await this.questionsInGameRepo.GetGameQuestionsInfoOrdered(
          game.id,
          game.player_1_id,
          game.player_2_id,
        );

        let answers = QuizGameQuestionsExtendedInfoEntity.GetPlayersAnswersInfo(answersInfo);

        let currentGameInfo: QuizGameInfo = new QuizGameInfo(
          game.id.toString(),
          new QuizGamePlayerProgressEntity(
            answers.firstPlayerResult,
            new QuizGamePlayerInfoEntity(game.player_1_id.toString(), usersInfo.find((info) => info.id === game.player_1_id).login),
            game.player_1_score,
          ),
          new QuizGamePlayerProgressEntity(
            answers.secondPlayerResult,
            new QuizGamePlayerInfoEntity(game.player_2_id.toString(), usersInfo.find((info) => info.id === game.player_2_id).login),
            game.player_2_score,
          ),
          answersInfo.map((answerLine) => new QuizGameQuestionInfoEntity(answerLine.questionId.toString(), answerLine.question)),
          game.status,
          game.createdAt,
          game.startedAt,
          game.endedAt,
        );

        return currentGameInfo;
      }),
    );

    return { count: countAndGames.count, games: result };
  }
  private async PendingSecondPlayerScenario(currentGame: GamesRepoEntity): Promise<QuizGameInfo> {
    let result: QuizGameInfo;

    let userInfo = await this.userRepo.ReadOneById(currentGame.player_1_id.toString());

    return QuizGameInfo.InitNewGame(currentGame.id.toString(), currentGame.player_1_id.toString(), userInfo.login, currentGame.createdAt);
  }
}
