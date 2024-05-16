import { QuizGameQuestionsExtendedInfoEntity } from "../self/repo/entities/QuizGameQuestionsExtendedInfoEntity";

export class GameQuizRules {
  public static ConvertAnswersToScores(userAnswers: string, correctAnswers: string[]): number {
    if (correctAnswers.includes(userAnswers)) return 1;

    return 0;
  }

  public static FinishExtraPoints(results: QuizGameQuestionsExtendedInfoEntity[]): { p1_points: number; p2_points: number } {
    let res = { p1_points: 0, p2_points: 0 };

    let p1_endTime = results[-1].p1_answer_time;
    let p2_endTime = results[-1].p2_answer_time;
    let p1_correctAnswerCount = results.filter((res) => res.answer.includes(res.p1_answer)).length;
    let p2_correctAnswerCount = results.filter((res) => res.answer.includes(res.p2_answer)).length;

    if (p1_endTime < p2_endTime && p1_correctAnswerCount > 0) res.p1_points = 1;
    else if (p2_endTime < p1_endTime && p2_correctAnswerCount > 0) res.p2_points = 1;

    return res;
  }
  public static GetGameQuestionCount() {
    return 5;
  }
}
