import { Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameInfo } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { GamesRepoEntity } from "../../repo/entities/GamesRepoEntity";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { QuizGameQuestionsExtendedInfoEntity } from "../../repo/entities/QuizGameQuestionsExtendedInfoEntity";
import { QuizGamePlayerProgressEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGamePlayerProgressEntity";
import { QuizGamePlayerInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGamePlayerInfoEntity";
import { QuizGameQuestionInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameQuestionInfoEntity";
import { UsersRepoService } from "../../../../../users/repo/UsersRepoService";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";

export class GameQuizGetMyCurrentCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GameQuizGetMyCurrentCommand)
@Injectable()
export class GameQuizGetMyCurrentUseCase implements ICommandHandler<GameQuizGetMyCurrentCommand, QuizGameInfo> {
  constructor(
    private quizGameRepo: GamesRepoService,
    private quizGameQuestionRepo: GameQuizQuestionsInGameService,
    private userRepo: UsersRepoService,
  ) {}

  async execute(command: GameQuizGetMyCurrentCommand): Promise<QuizGameInfo> {
    let currentGame = await this.quizGameRepo.GetUserCurrentGame(command.userId);

    if (!currentGame) throw new NotFoundException();

    if (currentGame.status == "PendingSecondPlayer") return this.PendingSecondPlayerScenario(currentGame);

    let usersInfo = await this.userRepo.GetIdLogin(currentGame.player_1_id, currentGame.player_2_id);
    let answersInfo: QuizGameQuestionsExtendedInfoEntity[] = await this.quizGameQuestionRepo.GetGameQuestionsInfoOrdered(
      currentGame.id,
      currentGame.player_1_id,
      currentGame.player_2_id,
    );

    let answers = QuizGameQuestionsExtendedInfoEntity.GetPlayersAnswersInfo(answersInfo);

    let currentGameInfo: QuizGameInfo = new QuizGameInfo(
      currentGame.id.toString(),
      new QuizGamePlayerProgressEntity(
        answers.firstPlayerResult,
        new QuizGamePlayerInfoEntity(
          currentGame.player_1_id.toString(),
          usersInfo.find((info) => info.id === currentGame.player_1_id).login,
        ),
        currentGame.player_1_score,
      ),
      new QuizGamePlayerProgressEntity(
        answers.secondPlayerResult,
        new QuizGamePlayerInfoEntity(
          currentGame.player_2_id.toString(),
          usersInfo.find((info) => info.id === currentGame.player_2_id).login,
        ),
        currentGame.player_2_score,
      ),
      answersInfo.map((answerLine) => new QuizGameQuestionInfoEntity(answerLine.questionId.toString(), answerLine.question)),
      "Active",
      currentGame.createdAt,
      currentGame.startedAt,
      currentGame.endedAt,
    );

    return currentGameInfo;
  }

  private async PendingSecondPlayerScenario(currentGame: GamesRepoEntity): Promise<QuizGameInfo> {
    let result: QuizGameInfo;

    let userInfo = await this.userRepo.ReadOneById(currentGame.player_1_id.toString());

    return QuizGameInfo.InitNewGame(currentGame.id.toString(), currentGame.player_1_id.toString(), userInfo.login, currentGame.createdAt);
  }
}
