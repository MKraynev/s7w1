import { GamesRepoEntity } from "../self/repo/entities/GamesRepoEntity";
import { QuizGameQuestionsExtendedInfoEntity } from "../self/repo/entities/QuizGameQuestionsExtendedInfoEntity";

export class GameQuizRules {
  public static ConvertAnswersToScores(userAnswers: string, correctAnswers: string[]): number {
    if (correctAnswers.includes(userAnswers)) return 1;

    return 0;
  }

  public static FinishExtraPoints(
    results: QuizGameQuestionsExtendedInfoEntity[],
    lastAnswer: string,
    lastAnswerTime: Date,
  ): { p1_points: number; p2_points: number } {
    let res = { p1_points: 0, p2_points: 0 };

    let p1_correctAnswerCount = results.filter((res) => res.answer.includes(res.p1_answer)).length;
    let p2_correctAnswerCount = results.filter((res) => res.answer.includes(res.p2_answer)).length;

    let p1_endTime: Date;
    let p2_endTime: Date;

    let lastResult = results.pop();

    if (lastResult.p1_answer) {
      p2_correctAnswerCount += lastResult.answer.includes(lastAnswer) ? 1 : 0;
      p2_endTime = lastAnswerTime;

      p1_endTime = lastResult.p1_answer_time;
    } else {
      p1_correctAnswerCount += lastResult.answer.includes(lastAnswer) ? 1 : 0;
      p1_endTime = lastAnswerTime;

      p2_endTime = lastResult.p2_answer_time;
    }

    if (+new Date(p1_endTime) < +new Date(p2_endTime) && p1_correctAnswerCount > 0) res.p1_points = 1;
    else if (+new Date(p2_endTime) < +new Date(p1_endTime) && p2_correctAnswerCount > 0) res.p2_points = 1;

    return res;
  }
  public static GetGameQuestionCount() {
    return 5;
  }

  public static GameIsReady(obj: Object) {
    return false;
  }

  public static AllPlayersAreReady(game: GamesRepoEntity) {
    return game.player_1 && game.player_2;
  }

  public static SecondUserAnswerAvailableTime_ms() {
    return 10000;
  }
}
