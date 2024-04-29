import { Module } from '@nestjs/common';
import { QuizGameMyCurrentUseCase } from './use-cases/QuizGameMyCurrentUsecase';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizGameConnectToGameUseCase } from './use-cases/QuizGameConnectToGameUsecase';
import { QuizGameRepoModule } from './repo/GamesRepoModule';
import { UsersRepoModule } from '../users/repo/UsersRepoModule';
import { QuizGameQuestionsModule } from '../quiz_game_questions/quiz_game_questions_repo_module';
import { GamesPairGameQuizController } from './controller/GamesPairGameQuizController';

export const QuizGameUseCases = [
  QuizGameMyCurrentUseCase,
  QuizGameConnectToGameUseCase,
];

@Module({
  imports: [
    QuizGameRepoModule,
    UsersRepoModule,
    QuizGameQuestionsModule,
    CqrsModule,
  ],
  controllers: [GamesPairGameQuizController],
  providers: [...QuizGameUseCases],
  exports: [...QuizGameUseCases],
})
export class GamesModule {}
