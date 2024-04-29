import { QuizGamePlayerInfoEntity } from './QuizGamePlayerInfoEntity';
import { QuizGamePlayerProgressEntity } from './QuizGamePlayerProgressEntity';
import { QuizGameQuestionInfoEntity } from './QuizGameQuestionInfoEntity';
import { QuizGameStatus } from './QuizGameStatusEnum';

export class QuizGameInfo {
  constructor(
    public id: string,
    public firstPlayerProgress: QuizGamePlayerProgressEntity,
    public secondPlayerProgress: QuizGamePlayerProgressEntity,
    public questions: QuizGameQuestionInfoEntity[],
    public status: QuizGameStatus,
    public pairCreatedDate: Date,
    public startGameDate: Date,
    public finishGameDate: Date,
  ) {}

  public static GetPendingForm(
    gameId: string,
    userId: string,
    userLogin: string,
    gameCreatedAt: Date,
  ) {
    let res = new QuizGameInfo(
      gameId,
      new QuizGamePlayerProgressEntity(
        [],
        new QuizGamePlayerInfoEntity(userId, userLogin),
        0,
      ),
      null,
      null,
      'PendingSecondPlayer',
      gameCreatedAt,
      null,
      null,
    );

    return res;
  }
}
