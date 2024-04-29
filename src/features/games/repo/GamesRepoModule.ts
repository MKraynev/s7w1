import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesRepoEntity } from './entities/GamesRepoEntity';
import { GamesRepoService } from './GamesRepoService';
import { QuizGameAnswerRepoEntity } from './entities/GamesAnswersRepoEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GamesRepoEntity, QuizGameAnswerRepoEntity]),
  ],
  providers: [GamesRepoService],
  exports: [GamesRepoService],
})
export class QuizGameRepoModule {}
