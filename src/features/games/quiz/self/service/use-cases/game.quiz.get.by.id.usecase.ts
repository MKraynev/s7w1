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
import { QuizGameAnswerInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameAnswerInfoEntity";

export class GameQuizGetByIdCommand {
  constructor(
    public gameId: string,
    public userId: string,
  ) {}
}

// @CommandHandler(GameQuizGetByIdCommand)
// @Injectable()
// export class GameQuizGetByIdUseCase implements ICommandHandler<GameQuizGetByIdCommand, QuizGameInfo> {
//   constructor(
//     private gamesRepo: GamesRepoService,
//     private questionsInGameRepo: GameQuizQuestionsInGameService,
//     private userRepo: UsersRepoService,
//   ) {}

//   async execute(command: GameQuizGetByIdCommand): Promise<QuizGameInfo> {
//     let game = await this.gamesRepo.FindOneById(command.gameId, true);
//     if (!game) throw new NotFoundException();

//     let userId_num = +command.userId;
//     if (game.player_1_id !== userId_num && game.player_2_id !== userId_num) throw new ForbiddenException();

//     if (game.status === "PendingSecondPlayer") return this.PendingSecondPlayerScenario(game);

//     let usersInfo = await this.userRepo.GetIdLogin(game.player_1_id, game.player_2_id);

//     let answersInfo: QuizGameQuestionsExtendedInfoEntity[] = await this.questionsInGameRepo.GetGameQuestionsInfoOrdered(
//       game.id,
//       game.player_1_id,
//       game.player_2_id,
//     );

//     console.log("GameQuizGetByIdUseCase, found game:", game);

//     // let answers = QuizGameQuestionsExtendedInfoEntity.GetPlayersAnswersInfo(answersInfo);
//     let firstPlayerAnswersInfo: QuizGameAnswerInfoEntity[] = game.answers_p1.map((a) =>
//       QuizGameAnswerInfoEntity.Init(
//         a.id.toString(),
//         answersInfo.find((ai) => ai.questionId === a.questionId).answer.includes(a.answer) ? "Correct" : "Incorrect",
//         a.createdAt,
//       ),
//     );

//     let secondPlayerAnswersInfo: QuizGameAnswerInfoEntity[] = game.answers_p2.map((a) =>
//       QuizGameAnswerInfoEntity.Init(
//         a.id.toString(),
//         answersInfo.find((ai) => ai.questionId === a.questionId).answer.includes(a.answer) ? "Correct" : "Incorrect",
//         a.createdAt,
//       ),
//     );

//     let currentGameInfo: QuizGameInfo = new QuizGameInfo(
//       game.id.toString(),
//       new QuizGamePlayerProgressEntity(
//         firstPlayerAnswersInfo,
//         new QuizGamePlayerInfoEntity(game.player_1_id.toString(), usersInfo.find((info) => info.id === game.player_1_id).login),
//         game.player_1_score,
//       ),
//       new QuizGamePlayerProgressEntity(
//         secondPlayerAnswersInfo,
//         new QuizGamePlayerInfoEntity(game.player_2_id.toString(), usersInfo.find((info) => info.id === game.player_2_id).login),
//         game.player_2_score,
//       ),
//       answersInfo.map((answerLine) => new QuizGameQuestionInfoEntity(answerLine.questionId.toString(), answerLine.question)),
//       game.status,
//       game.createdAt,
//       game.startedAt,
//       game.endedAt,
//     );

//     return currentGameInfo;
//   }
//   private async PendingSecondPlayerScenario(currentGame: GamesRepoEntity): Promise<QuizGameInfo> {
//     let result: QuizGameInfo;

//     let userInfo = await this.userRepo.ReadOneById(currentGame.player_1_id.toString());

//     return QuizGameInfo.InitNewGame(currentGame.id.toString(), currentGame.player_1_id.toString(), userInfo.login, currentGame.createdAt);
//   }
// }
