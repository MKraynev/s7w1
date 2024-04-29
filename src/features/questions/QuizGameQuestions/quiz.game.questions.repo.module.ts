import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizGameQuestionRepoEntity } from './entity/quiz.game.question.repo.entity';
import { QuizGameToQuestionsRepoService } from './quiz.game.questions.repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuizGameQuestionRepoEntity])],
  providers: [QuizGameToQuestionsRepoService],
  exports: [QuizGameToQuestionsRepoService],
})
export class QuizGameQuestionsModule {}
