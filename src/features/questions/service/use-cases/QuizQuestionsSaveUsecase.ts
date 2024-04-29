import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { QuizQuestionPostEntity } from '../../controllers/entities/QuestionsControllerPostEntity';
import { QuizQuestionEntity } from '../../repo/entity/QuestionsRepoEntity';
import { QuizQuestionRepoService } from '../../repo/QuestionsRepoService';

export class QuizQuestionsSaveCommand {
  constructor(public questionData: QuizQuestionPostEntity) {}
}
@Injectable()
@CommandHandler(QuizQuestionsSaveCommand)
export class QuizQuestionsSaveUseCase
  implements ICommandHandler<QuizQuestionsSaveCommand, QuizQuestionEntity>
{
  constructor(private repo: QuizQuestionRepoService) {}

  async execute(
    command: QuizQuestionsSaveCommand,
  ): Promise<QuizQuestionEntity> {
    let dto = await this.repo.Create(command.questionData);

    return dto;
  }
}
