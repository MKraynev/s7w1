import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuizQuestionPostEntity } from './entities/QuestionsControllerPostEntity';
import { CommandBus } from '@nestjs/cqrs';
import { QuizQuestionUpdatePublishStatusEntity } from './entities/QuestionsControllerUpdatePublishStatusEntity';
import { QuizQuestionRepoService } from '../repo/QuestionsRepoService';
import { QuizQuestionEntity } from '../repo/entity/QuestionsRepoEntity';
import { QuizQuestionsSaveCommand } from '../service/use-cases/QuizQuestionsSaveUsecase';
import { SuperAdminGuard } from '../../../guards/admin/GuardAdmin';
import { QueryPaginator } from '../../../paginator/QueryPaginatorDecorator';
import { InputPaginator } from '../../../paginator/entities/QueryPaginatorInputEntity';
import { OutputPaginator } from '../../../paginator/entities/QueryPaginatorUutputEntity';
import { ValidateParameters } from '../../../pipes/ValidationPipe';

@Controller('sa/quiz')
@UseGuards(SuperAdminGuard)
export class QuizQuestionsController {
  constructor(
    private commandBus: CommandBus,
    private quizRepo: QuizQuestionRepoService,
  ) {}

  @Get('questions')
  async GetAll(
    @Query('bodySearchTerm') bodySearchTerm: string | undefined,
    @Query('sortBy') sortBy: keyof QuizQuestionEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
  ) {
    let { count, questions } = await this.quizRepo.CountAndReadManyByName(
      bodySearchTerm,
      sortBy,
      sortDirecrion,
      paginator.skipElements,
      paginator.pageSize,
      true,
    );
    let questionsWithStringId = questions.map((question) =>
      question.GetWithStringId(),
    );

    let pagedQuesitons = new OutputPaginator(
      count,
      questionsWithStringId,
      paginator,
    );
    // await _WAIT_();
    return pagedQuesitons;
  }

  @Post('questions')
  async Create(
    @Body(new ValidateParameters()) questionData: QuizQuestionPostEntity,
  ) {
    let savedQuestion = await this.commandBus.execute<
      QuizQuestionsSaveCommand,
      QuizQuestionEntity
    >(new QuizQuestionsSaveCommand(questionData));

    return savedQuestion.GetWithStringId();
  }

  @Delete('questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async Delete(@Param('id') id: string) {
    let delCount = await this.quizRepo.DeleteById(id);

    if (delCount === 1) return;

    throw new NotFoundException();
  }

  @Put('questions/:id/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async SetPublishStatus(
    @Param('id') id: string,
    @Body(new ValidateParameters())
    updateData: QuizQuestionUpdatePublishStatusEntity,
  ) {
    let savedCount = await this.quizRepo.UpdatePublishStatus(
      id,
      updateData.published,
    );

    if (savedCount === 1) return;

    throw new NotFoundException();
  }

  @Put('questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async UpdateOne(
    @Param('id') id: string,
    @Body(new ValidateParameters()) questionData: QuizQuestionPostEntity,
  ) {
    let updatedCount = await this.quizRepo.UpdateOne(id, questionData);

    if (updatedCount === 1) return;

    throw new NotFoundException();
  }
}
