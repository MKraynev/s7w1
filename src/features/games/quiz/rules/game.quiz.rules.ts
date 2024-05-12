import { QuizGameQuestionsExtendedInfoEntity } from "../self/repo/entities/QuizGameQuestionsExtendedInfoEntity";

export class GameQuizRules {
  public static ConvertAnswersToScores(userAnswers: string, correctAnswers: string[]): number {
    return 1;
  }

  public static GetGameQuestionCount() {
    return 5;
  }
}
