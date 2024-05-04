import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { GameQuizQuestionsInGameRepoEntity } from "./entity/game.quiz.questions.in.game.repo.entity";
import { GameQuizQuestionsInGameService } from "./game.quiz.questions.in.game.repo.service";

@Module({
  imports: [TypeOrmModule.forFeature([GameQuizQuestionsInGameRepoEntity])],
  providers: [GameQuizQuestionsInGameService],
  exports: [GameQuizQuestionsInGameService],
})
export class QuizGameQuestionsInGameModule {}
