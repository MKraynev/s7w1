import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameComplexInfo } from "../entities/quiz.game.complex.info";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";

export class GameQuizGetByIdCommand {
  constructor(
    public gameId: string,
    public userId: string,
  ) {}
}
@CommandHandler(GameQuizGetByIdCommand)
@Injectable()
export class GameQuizGetByIdUseCase implements ICommandHandler<GameQuizGetByIdCommand, QuizGameComplexInfo> {
  constructor(
    private gamesRepo: GamesRepoService,
    private questionsInGameRepo: GameQuizQuestionsInGameService,
  ) {}

  async execute(command: GameQuizGetByIdCommand): Promise<QuizGameComplexInfo> {
    let answerStatus = ["Incorrect", "Correct"];

    let game = await this.gamesRepo.FindOneById(command.gameId, true);
    if (!game) throw new NotFoundException();

    let userId_num = +command.userId;
    if (game.player_1_id !== userId_num && game.player_2_id !== userId_num) throw new ForbiddenException();

    let gameInfo = new QuizGameComplexInfo(
      command.gameId,
      game.player_1.id.toString(),
      game.player_1.login,
      game.status,
      game.createdAt,
      game.startedAt,
      game.endedAt,
    );

    if (game.player_2) {
      let questionsAndUsersAnswers = await this.questionsInGameRepo.GetGameQuestionsInfoOrdered(
        game.id,
        game.player_1_id,
        game.player_2_id,
      );

      questionsAndUsersAnswers.forEach((qa) => {
        gameInfo.questions.push({ id: qa.questionId.toString(), body: qa.question });

        if (qa.p1_answer !== null) {
          gameInfo.firstPlayerProgress.answers.push({
            questionId: qa.questionId.toString(),
            answerStatus: qa.answer.includes(qa.p1_answer) ? answerStatus[1] : answerStatus[0],
            addedAt: qa.p1_answer_time,
          });
        }

        if (qa.p2_answer !== null) {
          gameInfo.secondPlayerProgress.answers.push({
            questionId: qa.questionId.toString(),
            answerStatus: qa.answer.includes(qa.p2_answer) ? answerStatus[1] : answerStatus[0],
            addedAt: qa.p2_answer_time,
          });
        }
      });

      gameInfo.firstPlayerProgress.player = { id: game.player_1_id.toString(), login: game.player_1.login };
      gameInfo.firstPlayerProgress.score = game.player_1_score;

      gameInfo.secondPlayerProgress.player = { id: game.player_2_id.toString(), login: game.player_2.login };
      gameInfo.secondPlayerProgress.score = game.player_2_score;
    }

    return gameInfo;
  }
}
