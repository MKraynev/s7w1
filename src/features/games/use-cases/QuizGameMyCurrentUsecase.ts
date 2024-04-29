import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizGameInfo } from '../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity';
import { GamesRepoEntity } from '../repo/entities/GamesRepoEntity';
import { GamesRepoService } from '../repo/GamesRepoService';
import { QuizGameToQuestionsRepoService } from 'src/features/quiz_game_questions/QuizGameQuestionsRepoService';
import { UsersRepoService } from 'src/features/users/repo/UsersRepoService';
import { QuizGameQuestionsExtendedInfoEntity } from '../repo/entities/QuizGameQuestionsExtendedInfoEntity';
import { QuizGamePlayerProgressEntity } from '../controller/entities/QuizGameGetMyCurrent/QuizGamePlayerProgressEntity';
import { QuizGamePlayerInfoEntity } from '../controller/entities/QuizGameGetMyCurrent/QuizGamePlayerInfoEntity';
import { QuizGameQuestionInfoEntity } from '../controller/entities/QuizGameGetMyCurrent/QuizGameQuestionInfoEntity';

export class QuizGameMyCurrentCommand {
  constructor(public userId: string) {}
}

@CommandHandler(QuizGameMyCurrentCommand)
@Injectable()
export class QuizGameMyCurrentUseCase
  implements ICommandHandler<QuizGameMyCurrentCommand, QuizGameInfo>
{
  private gameInfo: GamesRepoEntity | null = null;
  constructor(
    private quizGameRepo: GamesRepoService,
    private quizGameQuestionRepo: QuizGameToQuestionsRepoService,
    private userRepo: UsersRepoService,
  ) {}

  async execute(command: QuizGameMyCurrentCommand): Promise<QuizGameInfo> {
    this.gameInfo = await this.quizGameRepo.GetUserCurrentGame(command.userId);

    if (!this.gameInfo) throw new NotFoundException();

    if (this.gameInfo.status == 'PendingSecondPlayer')
      return this.PendingSecondPlayerScenario();

    let usersInfo = await this.userRepo.GetIdLogin(
      this.gameInfo.player_1_id,
      this.gameInfo.player_2_id,
    );
    let answersInfo: QuizGameQuestionsExtendedInfoEntity[] =
      await this.quizGameQuestionRepo.GetGameQuestionsInfoOrdered(
        this.gameInfo.id,
        this.gameInfo.player_1_id,
        this.gameInfo.player_2_id,
      );

    let answers =
      QuizGameQuestionsExtendedInfoEntity.GetPlayersInfo(answersInfo);

    let currentGame: QuizGameInfo = new QuizGameInfo(
      this.gameInfo.id.toString(),
      new QuizGamePlayerProgressEntity(
        answers.firstPlayerResult,
        new QuizGamePlayerInfoEntity(
          usersInfo[0].id.toString(),
          usersInfo[0].login,
        ),
        0,
      ),
      new QuizGamePlayerProgressEntity(
        answers.secondPlayerResult,
        new QuizGamePlayerInfoEntity(
          usersInfo[1].id.toString(),
          usersInfo[1].login,
        ),
        0,
      ),
      answersInfo.map(
        (answerLine) =>
          new QuizGameQuestionInfoEntity(
            answerLine.questionId.toString(),
            answerLine.question,
          ),
      ),
      'Active',
      this.gameInfo.createdAt,
      this.gameInfo.startedAt,
      null,
    );

    return currentGame;

    // SELECT m."questionId", q."body" question, q."correctAnswers" answer, m."orderNum", m."p1_answer", m."p1_answer_time", m."p2_answer", m."p2_answer_time"
    // FROM public."QuizQuestions" q
    // RIGHT JOIN (
    //   SELECT m1.*, a2."answer" p2_answer, a2."createdAt" p2_answer_time
    //   FROM public."Answers" a2
    //   RIGHT JOIN (
    //     SELECT qq."gameId", qq."questionId", qq."orderNum", a1."answer" p1_answer, a1."createdAt" p1_answer_time
    //     FROM public."QuizGameQuestion" qq
    //     LEFT JOIN public."Answers" a1
    //     ON qq."questionId" = a1."questionId" AND qq."gameId" = 5 AND a1."userId" = 31
    //   ) as m1
    //   ON a2."questionId" = m1."questionId" AND a2."userId" = 32
    // ) m
    // ON m."questionId" = q."id"
    // ORDER BY m."orderNum" ASC;
  }

  private async PendingSecondPlayerScenario(): Promise<QuizGameInfo> {
    let result: QuizGameInfo;

    let userInfo = await this.userRepo.ReadOneById(
      this.gameInfo.player_1_id.toString(),
    );

    return QuizGameInfo.GetPendingForm(
      this.gameInfo.id.toString(),
      this.gameInfo.player_1_id.toString(),
      userInfo.login,
      this.gameInfo.createdAt,
    );
  }
}
