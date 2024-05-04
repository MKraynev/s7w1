export type AvailableAnswerStatus = 'Correct' | 'Incorrect';

export class QuizGameAnswerInfoEntity {
  public answerStatus: AvailableAnswerStatus;
  constructor(
    public questionId: string,
    rightAnswer: string[],
    userAnswer: string,
    public addedAt: Date
  ) {
    this.answerStatus = rightAnswer.includes(userAnswer) ? 'Correct' : 'Incorrect';
  }
}
