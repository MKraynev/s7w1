import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameComplexInfo } from "../entities/quiz.game.complex.info";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { UsersRepoService } from "../../../../../users/repo/UsersRepoService";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";

export class GameQuizGetByIdCommand {
  constructor(
    public gameId: string,
    public userId: string,
  ) {}
}
@CommandHandler(GameQuizGetByIdCommand)
@Injectable()
export class GameQuizGetByIdUseCase
  implements ICommandHandler<GameQuizGetByIdCommand, QuizGameComplexInfo>
{
  constructor(
    private gamesRepo: GamesRepoService,
    private userRepo: UsersRepoService,
    private answersInGameRepo: GameQuizQuestionsInGameService,
  ) {}

  async execute(command: GameQuizGetByIdCommand): Promise<QuizGameComplexInfo> {
    let result: QuizGameComplexInfo;

    let game = await this.gamesRepo.FindOneById(command.gameId);
    if (!game) throw new NotFoundException();

    let userId_num = +command.userId;

    if (isNaN(userId_num) || game.player_1_id !== userId_num || game.player_2_id !== userId_num)
      throw new ForbiddenException("wrong user");

    let p1_info = await this.userRepo.ReadOneByIdShort(game.player_1_id.toString());
    // let p1_answers = await this.answersInGameRepo.GetGameQuestionsInfoOrdered();
    // let p2_info = await this.userRepo.ReadOneById(game.player_2_id.toString());
    //TODO дописать
    return result;
  }
}

/*

  "id": "string",
  "firstPlayerProgress": {
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
