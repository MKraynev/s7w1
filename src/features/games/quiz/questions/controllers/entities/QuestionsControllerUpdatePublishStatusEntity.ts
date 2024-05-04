import { IsBoolean } from 'class-validator';

export class QuizQuestionUpdatePublishStatusEntity {
  @IsBoolean()
  public published: boolean;
}
