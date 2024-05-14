import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { GameQuizQuestionsInGameRepoEntity } from "./entity/game.quiz.questions.in.game.repo.entity";
import { GameQuizQuestionsInGameService } from "./game.quiz.questions.in.game.repo.service";
import { GameQuizAnswersRepoModule } from "../../answers/repo/game.quiz.answers.repo.module";
import { QuizQuestRepoModule } from "../../questions/repo/QuestionsRepoModule";

@Module({
  imports: [TypeOrmModule.forFeature([GameQuizQuestionsInGameRepoEntity]), GameQuizAnswersRepoModule, QuizQuestRepoModule],
  providers: [GameQuizQuestionsInGameService],
  exports: [GameQuizQuestionsInGameService],
})
export class QuizGameQuestionsInGameModule {}
