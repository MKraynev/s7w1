import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandBus, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameAnswerResult } from "../entities/quiz.game.answer.result";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";
import { QuizGameQuestionsExtendedInfoEntity } from "../../repo/entities/QuizGameQuestionsExtendedInfoEntity";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { GameQuizAnswersRepoService } from "../../../answers/repo/game.quiz.answers.repo.service";
import { QuizGameAnswerRepoEntity } from "../../../answers/repo/entities/GamesAnswersRepoEntity";
import { GameQuizWinnersRepoService } from "../../../winners/repo/game.quiz.winners.repo.service";
import { QuizGameStatus } from "../../../winners/repo/entity/game.quiz.winner.repo.entity";

export class GameQuizAnswerTheQuestionCommand {
  constructor(
    public userId: string,
    public userLogin: string,
    public answer: string,
  ) {}
}

@Injectable()
@CommandHandler(GameQuizAnswerTheQuestionCommand)
export class GameQuizAnswerTheQuestionUseCase implements ICommandHandler<GameQuizAnswerTheQuestionCommand, QuizGameAnswerResult> {
  constructor(
    private gameRepo: GamesRepoService,
    private quizGameQuestionRepo: GameQuizQuestionsInGameService,
    private answerRepo: GameQuizAnswersRepoService,
    private winerRepo: GameQuizWinnersRepoService,
  ) {}
  async execute(command: GameQuizAnswerTheQuestionCommand): Promise<QuizGameAnswerResult> {
    //TODO прокинуть логику через сущность QuizGame.Play()
    //которая принимает и возвращает все задействованные repo entity

    //TODO обернуть все в транзакцию
    let userGame = await this.gameRepo.GetUserCurrentGame(command.userId);

    if (!userGame || userGame.status !== "Active") {
      console.log("first if: !userGame || userGame.status !== Active", !userGame || userGame.status !== "Active");
      throw new ForbiddenException();
    }

    let gameQuestionsAndAnswersInfo = await this.quizGameQuestionRepo.GetGameQuestionsInfoOrdered(
      userGame.id,
      userGame.player_1_id,
      userGame.player_2_id,
    );

    let currentQuestion: QuizGameQuestionsExtendedInfoEntity;

    let userIsFirstPlayer = +command.userId === userGame.player_1_id;
    if (userIsFirstPlayer) currentQuestion = gameQuestionsAndAnswersInfo.filter((info) => info.p1_answer === null)[0];
    else currentQuestion = gameQuestionsAndAnswersInfo.filter((info) => info.p2_answer === null)[0];

    if (!currentQuestion) {
      console.log("second 403, !currentQuestion", currentQuestion);
      throw new ForbiddenException(); //player answered all questions
    }

    if (userIsFirstPlayer) userGame.player_1_score += GameQuizRules.ConvertAnswersToScores(command.answer, currentQuestion.answer);
    else userGame.player_2_score += GameQuizRules.ConvertAnswersToScores(command.answer, currentQuestion.answer);

    let savedAnswer = await this.answerRepo.Save(
      userGame.id.toString(),
      currentQuestion.questionId.toString(),
      command.userId,
      command.answer,
    );

    if (this.BothUsersAnsweredAllQuestions(gameQuestionsAndAnswersInfo, userIsFirstPlayer)) {
      userGame.status = "Finished";
      userGame.endedAt = savedAnswer.createdAt;

      let { p1_points, p2_points } = GameQuizRules.FinishExtraPoints(gameQuestionsAndAnswersInfo, command.answer, savedAnswer.createdAt);
      userGame.player_1_score += p1_points;
      userGame.player_2_score += p2_points;

      let p1_status: QuizGameStatus;
      let p2_status: QuizGameStatus;
      let playersScoreDiff = userGame.player_1_score - userGame.player_2_score;

      switch (playersScoreDiff) {
        case 0:
          p1_status = QuizGameStatus.draw;
          p2_status = QuizGameStatus.draw;
          break;

        default:
          if (playersScoreDiff) {
            p1_status = QuizGameStatus.win;
            p2_status = QuizGameStatus.lose;
          } else {
            p1_status = QuizGameStatus.lose;
            p2_status = QuizGameStatus.win;
          }
      }
      let p1_winner = await this.winerRepo.Update(userGame.player_1_id, p1_status, userGame.player_1_score);
      let p2_winner = await this.winerRepo.Update(userGame.player_2_id, p2_status, userGame.player_2_score);
    }

    await this.gameRepo.Save(userGame);

    return new QuizGameAnswerResult(
      currentQuestion.questionId.toString(),
      currentQuestion.answer.includes(command.answer) ? "Correct" : "Incorrect",
      savedAnswer.createdAt,
    );
  }

  private BothUsersAnsweredAllQuestions(
    gameQuestionsAndAnswersInfo: QuizGameQuestionsExtendedInfoEntity[],
    userIsFirstPlayer: boolean,
  ): boolean {
    let firstPlayerUnansweredQuestionsCount = gameQuestionsAndAnswersInfo.filter((info) => info.p1_answer === null).length;
    let secondPlayerUnansweredQuestionsCount = gameQuestionsAndAnswersInfo.filter((info) => info.p2_answer === null).length;

    if (userIsFirstPlayer && firstPlayerUnansweredQuestionsCount === 1 && secondPlayerUnansweredQuestionsCount === 0) return true;
    else if (!userIsFirstPlayer && secondPlayerUnansweredQuestionsCount === 1 && firstPlayerUnansweredQuestionsCount === 0) return true;

    return false;
  }
}
