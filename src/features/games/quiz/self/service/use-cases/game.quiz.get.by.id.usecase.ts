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

      gameInfo.setFirstPlayerProgress(
        questionsAndUsersAnswers
          .filter((qa) => qa.p1_answer !== null)
          .map((qa) => {
            return {
              questionId: qa.questionId.toString(),
              answerStatus: qa.answer.includes(qa.p1_answer) ? "Correct" : "Incorrect",
              addedAt: qa.p1_answer_time,
            };
          }),
        game.player_1_score,
      );

      gameInfo.SetSecondPlayerProgress(
        game.player_2_id.toString(),
        game.player_2.login,
        questionsAndUsersAnswers
          .filter((qa) => qa.p2_answer !== null)
          .map((qa) => {
            return {
              questionId: qa.questionId.toString(),
              answerStatus: qa.answer.includes(qa.p2_answer) ? "Correct" : "Incorrect",
              addedAt: qa.p1_answer_time,
            };
          }),
        game.player_2_score,
      );
    }

    return gameInfo;
  }
}
