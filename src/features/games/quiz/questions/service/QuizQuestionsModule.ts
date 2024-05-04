import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { QuizQuestionsSaveUseCase } from "./use-cases/QuizQuestionsSaveUsecase";
import { QuizQuestRepoModule } from "../repo/QuestionsRepoModule";
import { QuizQuestionsController } from "../controllers/QuizQuestionsController";

const QuizUseCases = [QuizQuestionsSaveUseCase];

@Module({
  imports: [CqrsModule, QuizQuestRepoModule],
  controllers: [QuizQuestionsController],
  providers: [...QuizUseCases],
})
export class QuizQuestionsModule {}
