import { QuizGameQuestionsExtendedInfoEntity } from "../self/repo/entities/QuizGameQuestionsExtendedInfoEntity";

export class GameQuizRules {
  public static ConvertAnswersToScores(userAnswers: string, correctAnswers: string[]): number {
    if (correctAnswers.includes(userAnswers)) return 1;

    return 0;
  }

  public static GetGameQuestionCount() {
    return 5;
  }
}
