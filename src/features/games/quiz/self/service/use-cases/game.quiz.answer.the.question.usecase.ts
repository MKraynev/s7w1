import { ForbiddenException, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandBus, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameAnswerResult } from "../entities/quiz.game.answer.result";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";
import { QuizGameQuestionsExtendedInfoEntity } from "../../repo/entities/QuizGameQuestionsExtendedInfoEntity";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { GameQuizAnswersRepoService } from "../../../answers/repo/game.quiz.answers.repo.service";

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

    let playerUnansweredQuestion: QuizGameQuestionsExtendedInfoEntity;

    if (+command.userId === userGame.player_1_id)
      playerUnansweredQuestion = gameQuestionsAndAnswersInfo.filter((info) => info.p1_answer === null)[0];
    else playerUnansweredQuestion = gameQuestionsAndAnswersInfo.filter((info) => info.p2_answer === null)[0];

    if (!playerUnansweredQuestion) throw new ForbiddenException(); //player answered all questions

    await this.answerRepo.Save(userGame.id.toString(), playerUnansweredQuestion.questionId.toString(), command.userId, command.answer);

    return new QuizGameAnswerResult(
      playerUnansweredQuestion.questionId.toString(),
      playerUnansweredQuestion.answer.includes(command.answer) ? "Correct" : "Incorrect",
      new Date(),
    );
  }
}
