import { ArrayMinSize, IsArray, IsString, MaxLength, MinLength } from 'class-validator';

export class QuizQuestionPostEntity {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  public body: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  public correctAnswers: string[];
}
