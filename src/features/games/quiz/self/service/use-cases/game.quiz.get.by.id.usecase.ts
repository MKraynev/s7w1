import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameComplexInfo } from "../entities/quiz.game.complex.info";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";
import { QuizGameInfo } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { QuizGamePlayerProgressEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGamePlayerProgressEntity";
import { UsersRepoService } from "../../../../../users/repo/UsersRepoService";
import { QuizGameQuestionsExtendedInfoEntity } from "../../repo/entities/QuizGameQuestionsExtendedInfoEntity";
import { QuizGamePlayerInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGamePlayerInfoEntity";
import { QuizGameQuestionInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameQuestionInfoEntity";
import { GamesRepoEntity } from "../../repo/entities/GamesRepoEntity";

export class GameQuizGetByIdCommand {
  constructor(
    public gameId: string,
    public userId: string,
  ) {}
}
@CommandHandler(GameQuizGetByIdCommand)
@Injectable()
export class GameQuizGetByIdUseCase implements ICommandHandler<GameQuizGetByIdCommand, QuizGameInfo> {
  constructor(
    private gamesRepo: GamesRepoService,
    private questionsInGameRepo: GameQuizQuestionsInGameService,
    private userRepo: UsersRepoService,
  ) {}

  async execute(command: GameQuizGetByIdCommand): Promise<QuizGameInfo> {
    let game = await this.gamesRepo.FindOneById(command.gameId, true);
    if (!game) throw new NotFoundException();

    let userId_num = +command.userId;
    if (game.player_1_id !== userId_num && game.player_2_id !== userId_num) throw new ForbiddenException();

    // let gameInfo = new QuizGameComplexInfo(
    //   command.gameId,
    //   game.player_1.id.toString(),
    //   game.player_1.login,
    //   game.status,
    //   game.createdAt,
    //   game.startedAt,
    //   game.endedAt,
    // );

    // if (game.player_2) {

    //   // let questionsAndUsersAnswers = await this.questionsInGameRepo.GetGameQuestionsInfoOrdered(
    //   //   game.id,
    //   //   game.player_1_id,
    //   //   game.player_2_id,
    //   // );

    //   // gameInfo.setFirstPlayerProgress(
    //   //   questionsAndUsersAnswers
    //   //     .filter((qa) => qa.p1_answer !== null)
    //   //     .map((qa) => {
    //   //       return {
    //   //         questionId: qa.questionId.toString(),
    //   //         answerStatus: qa.answer.includes(qa.p1_answer) ? "Correct" : "Incorrect",
    //   //         addedAt: qa.p1_answer_time,
    //   //       };
    //   //     }),
    //   //   game.player_1_score,
    //   // );

    //   // gameInfo.SetSecondPlayerProgress(
    //   //   game.player_2_id.toString(),
    //   //   game.player_2.login,
    //   //   questionsAndUsersAnswers
    //   //     .filter((qa) => qa.p2_answer !== null)
    //   //     .map((qa) => {
    //   //       return {
    //   //         questionId: qa.questionId.toString(),
    //   //         answerStatus: qa.answer.includes(qa.p2_answer) ? "Correct" : "Incorrect",
    //   //         addedAt: qa.p2_answer_time,
    //   //       };
    //   //     }),
    //   //   game.player_2_score,
    //   // );

    //   // gameInfo.questions = questionsAndUsersAnswers.map((qa) => {
    //   //   return {
    //   //     id: qa.questionId.toString(),
    //   //     body: qa.question,
    //   //   };
    //   // });
    // }

    if (game.status == "PendingSecondPlayer") return this.PendingSecondPlayerScenario(game);

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
        new QuizGamePlayerInfoEntity(usersInfo[0].id.toString(), usersInfo[0].login),
        game.player_1_score,
      ),
      new QuizGamePlayerProgressEntity(
        answers.secondPlayerResult,
        new QuizGamePlayerInfoEntity(usersInfo[1].id.toString(), usersInfo[1].login),
        game.player_2_score,
      ),
      answersInfo.map((answerLine) => new QuizGameQuestionInfoEntity(answerLine.questionId.toString(), answerLine.question)),
      game.status,
      game.createdAt,
      game.startedAt,
      null,
    );

    return currentGameInfo;
  }
  private async PendingSecondPlayerScenario(currentGame: GamesRepoEntity): Promise<QuizGameInfo> {
    let result: QuizGameInfo;

    let userInfo = await this.userRepo.ReadOneById(currentGame.player_1_id.toString());

    return QuizGameInfo.InitNewGame(currentGame.id.toString(), currentGame.player_1_id.toString(), userInfo.login, currentGame.createdAt);
  }
}
