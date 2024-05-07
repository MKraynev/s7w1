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

    let game = await this.gamesRepo.FindOneById(command.gameId);
    if (!game) throw new NotFoundException();

    let userId_num = +command.userId;

    if (isNaN(userId_num) || (game.player_1_id !== userId_num && game.player_2_id !== userId_num))
      throw new ForbiddenException("wrong user");

    let gameInfo = new QuizGameComplexInfo(game.id.toString());

    let questionsAndUsersAnswers = await this.questionsInGameRepo.GetGameQuestionsInfoOrdered(game.id, game.player_1_id, game.player_2_id);

    questionsAndUsersAnswers.forEach((qa) => {
      gameInfo.questions.push({ id: qa.questionId.toString(), body: qa.question });

      if (qa.p1_answer !== null) {
        gameInfo.firstPlayerProgress.answers.push({
          questionId: qa.questionId.toString(),
          answerStatus: qa.answer.includes(qa.p1_answer) ? answerStatus[1] : answerStatus[0],
          addedAt: qa.p1_answer_time,
        });
        gameInfo.firstPlayerProgress.score += GameQuizRules.ConvertAnswersToScores(qa.p1_answer, qa.answer);
      }

      if (qa.p2_answer !== null) {
        gameInfo.secondPlayerProgress.answers.push({
          questionId: qa.questionId.toString(),
          answerStatus: qa.answer.includes(qa.p2_answer) ? answerStatus[1] : answerStatus[0],
          addedAt: qa.p2_answer_time,
        });
        gameInfo.secondPlayerProgress.score += GameQuizRules.ConvertAnswersToScores(qa.p2_answer, qa.answer);
      }
    });

    gameInfo.firstPlayerProgress.player = { id: game.player_1_id.toString(), login: game.player_1.login };
    gameInfo.secondPlayerProgress.player = { id: game.player_2_id.toString(), login: game.player_2.login };

    gameInfo.status = game.status;
    gameInfo.pairCreatedDate = game.createdAt;
    gameInfo.startGameDate = game.startedAt;
    gameInfo.finishGameDate = game.endedAt;

    return gameInfo;
  }
}

/*

  "id": "string",
  "firstPlayerProgress": {
    "answers": [
      {
        "questionId": "string",
        "answerStatus": "Correct",
        "§": "2024-05-02T18:13:46.358Z"
      }
    ],
    "player": {
      "id": "string",
      "login": "string"
    },
    "score": 0
  },
  "secondPlayerProgress": {
    "answers": [
      {
        "questionId": "string",
        "answerStatus": "Correct",
        "addedAt": "2024-05-02T18:13:46.358Z"
      }
    ],
    "player": {
      "id": "string",
      "login": "string"
    },
    "score": 0
  },
  "questions": [
    {
      "id": "string",
      "body": "string"
    }
  ],
  "status": "PendingSecondPlayer",
  "pairCreatedDate": "2024-05-02T18:13:46.358Z",
  "startGameDate": "2024-05-02T18:13:46.358Z",
  "finishGameDate": "2024-05-02T18:13:46.358Z"
}
*/