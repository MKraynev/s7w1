import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionEntity } from './entity/QuestionsRepoEntity';
import { QuizQuestionRepoService } from './QuestionsRepoService';

@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestionEntity])],
  providers: [QuizQuestionRepoService],
  exports: [QuizQuestionRepoService],
})
export class QuizQuestRepoModule {}
