import { ForbiddenException, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandBus, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameAnswerResult } from "../entities/quiz.game.answer.result";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";
import { QuizGameQuestionsExtendedInfoEntity } from "../../repo/entities/QuizGameQuestionsExtendedInfoEntity";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { GameQuizAnswersRepoService } from "../../../answers/repo/game.quiz.answers.repo.service";
import { QuizGameAnswerRepoEntity } from "../../../answers/repo/entities/GamesAnswersRepoEntity";

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
  ) {}
  async execute(command: GameQuizAnswerTheQuestionCommand): Promise<QuizGameAnswerResult> {
    let userGame = await this.gameRepo.GetUserCurrentGame(command.userId);
    if (!userGame) throw new ForbiddenException();

    let gameQuestionsAndAnswersInfo = await this.quizGameQuestionRepo.GetGameQuestionsInfoOrdered(
      userGame.id,
      userGame.player_1_id,
      userGame.player_2_id,
    );

    //DEBUG
    console.log("command ->", command);
    console.log("q status: \n", gameQuestionsAndAnswersInfo);
    console.log("game status before logic ->", userGame);

    let currentQuestion: QuizGameQuestionsExtendedInfoEntity;

    let userIsFirstPlayer = +command.userId === userGame.player_1_id;
    if (userIsFirstPlayer) currentQuestion = gameQuestionsAndAnswersInfo.filter((info) => info.p1_answer === null)[0];
    else currentQuestion = gameQuestionsAndAnswersInfo.filter((info) => info.p2_answer === null)[0];

    if (!currentQuestion) throw new ForbiddenException(); //player answered all questions

    if (userIsFirstPlayer) userGame.player_1_score += GameQuizRules.ConvertAnswersToScores(command.answer, currentQuestion.answer);
    else userGame.player_2_score += GameQuizRules.ConvertAnswersToScores(command.answer, currentQuestion.answer);

    console.log("first player ->", userIsFirstPlayer);
    console.log("current question status ->", currentQuestion);

    if (this.BothUsersAnsweredAllQuestions(gameQuestionsAndAnswersInfo, userIsFirstPlayer)) {
      userGame.status = "Finished";
      userGame.endedAt = new Date();

      console.log("both users answered right now");
    }

    let savedAnswer = await this.answerRepo.Save(
      userGame.id.toString(),
      currentQuestion.questionId.toString(),
      command.userId,
      command.answer,
    );

    await this.gameRepo.Save(userGame);

    //DEBUG
    console.log("game status before return ->", userGame);

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

    console.log("first unanswered:", firstPlayerUnansweredQuestionsCount);
    console.log("second unanswered:", secondPlayerUnansweredQuestionsCount);

    if (userIsFirstPlayer && firstPlayerUnansweredQuestionsCount === 1 && secondPlayerUnansweredQuestionsCount === 0) return true;
    else if (!userIsFirstPlayer && secondPlayerUnansweredQuestionsCount === 1 && firstPlayerUnansweredQuestionsCount === 0) return true;

    return false;
  }
}
