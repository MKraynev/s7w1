import { QuizGameAnswerInfoEntity } from './QuizGameAnswerInfoEntity';
import { QuizGamePlayerInfoEntity } from './QuizGamePlayerInfoEntity';

export class QuizGamePlayerProgressEntity {
  constructor(
    public answers: QuizGameAnswerInfoEntity[],
    public player: QuizGamePlayerInfoEntity,
    public score: number,
  ) {}
}
