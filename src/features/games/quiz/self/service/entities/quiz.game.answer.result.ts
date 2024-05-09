export class QuizGameAnswerResult {
  constructor(
    public questionId: string,
    public answerStatus: "Correct" | "Incorrect",
    public addedAt: Date,
  ) {}
}
