import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizGameQuestionRepoEntity } from './entity/QuizGameQuestionRepoEntity';
import { Module } from '@nestjs/common';
import { QuizGameToQuestionsRepoService } from './QuizGameQuestionsRepoService';

@Module({
  imports: [TypeOrmModule.forFeature([QuizGameQuestionRepoEntity])],
  providers: [QuizGameToQuestionsRepoService],
  exports: [QuizGameToQuestionsRepoService],
})
export class QuizGameQuestionsModule {}
