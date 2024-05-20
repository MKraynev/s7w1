import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { GamesRepoEntity } from "../repo/entities/GamesRepoEntity";
import { QuizGameInfo } from "./entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { JwtAuthGuard } from "../../../../../guards/common/JwtAuthGuard";
import { JwtServiceUserAccessTokenLoad } from "../../../../../jwt/entities/JwtServiceAccessTokenLoad";
import { ReadAccessToken } from "../../../../../jwt/decorators/JwtRequestReadAccessToken";
import { GameQuizGetMyCurrentCommand } from "../service/use-cases/game.quiz.get.my.current.usecase";
import { QuizGameConnectToGameCommand } from "../service/use-cases/game.quiz.connection.usecase";
import { GameQuizGetByIdCommand } from "../service/use-cases/game.quiz.get.by.id.usecase";
import { QuizGameComplexInfo } from "../service/entities/quiz.game.complex.info";
import { ValidateParameters } from "../../../../../pipes/ValidationPipe";
import {
  GameQuizAnswerTheQuestionCommand,
  GameQuizAnswerTheQuestionUseCase,
} from "../service/use-cases/game.quiz.answer.the.question.usecase";
import { QuizGameAnswerResult } from "../service/entities/quiz.game.answer.result";
import { QueryPaginator } from "../../../../../paginator/QueryPaginatorDecorator";
import { InputPaginator } from "../../../../../paginator/entities/QueryPaginatorInputEntity";
import { GameQuizGetPairsMyCommand, GameQuizGetPairsMyUseCase } from "../service/use-cases/game.quiz.get.pairs.my.usecase";
import { OutputPaginator } from "../../../../../paginator/entities/QueryPaginatorUutputEntity";
import { GameQuizGetMyStatisticCommand } from "../service/use-cases/game.quiz.get.my.statistic.usecase";

@Controller("pair-game-quiz")
export class GamesPairGameQuizController {
  constructor(private commandBus: CommandBus) {}

  @Get("pairs/my")
  @UseGuards(JwtAuthGuard)
  public async GetAllMyGames(
    @ReadAccessToken() token: JwtServiceUserAccessTokenLoad,
    @Query("sortBy") sortBy: string = "pairCreatedDate",
    @Query("sortDirection") sortDirecrion: "desc" | "asc" = "desc",
    @QueryPaginator() paginator: InputPaginator,
  ) {
    let sortByKeyOf: keyof GamesRepoEntity;
    switch (sortBy) {
      case "pairCreatedDate":
      default:
        sortByKeyOf = "startedAt";
    }

    let games = await this.commandBus.execute<GameQuizGetPairsMyCommand, { count: number; games: QuizGameInfo[] }>(
      new GameQuizGetPairsMyCommand(token, {
        sortBy: sortByKeyOf,
        sortDirection: sortDirecrion,
        skip: paginator.skipElements,
        limit: paginator.pageSize,
      }),
    );

    let pagedGames = new OutputPaginator(games.count, games.games, paginator);
    return pagedGames;
  }

  @Get("users/my-statistic")
  @UseGuards(JwtAuthGuard)
  public async GetMyStatistic(@ReadAccessToken() token: JwtServiceUserAccessTokenLoad) {
    let statistic = await this.commandBus.execute<
      GameQuizGetMyStatisticCommand,
      { sumScore: number; avgScores: number; gamesCount: number; winsCount: number; lossesCount: number; drawsCount: number }
    >(new GameQuizGetMyStatisticCommand(token));

    return statistic;
  }

  @Get("pairs/my-current")
  @UseGuards(JwtAuthGuard)
  public async GetCurrentUserGame(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {
    let game = await this.commandBus.execute<GameQuizGetMyCurrentCommand, GamesRepoEntity>(new GameQuizGetMyCurrentCommand(tokenLoad.id));

    return game;
  }

  @Post("pairs/my-current/answers")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async SendAnswer(
    @ReadAccessToken() token: JwtServiceUserAccessTokenLoad,
    @Body(new ValidateParameters()) userResponse: { answer: string },
  ) {
    let answerResult = await this.commandBus.execute<GameQuizAnswerTheQuestionCommand, QuizGameAnswerResult>(
      new GameQuizAnswerTheQuestionCommand(token.id, token.login, userResponse.answer),
    );

    return answerResult;
  }

  @Get("pairs/:id")
  @UseGuards(JwtAuthGuard)
  public async GetById(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad, @Param("id") id: string) {
    let game = await this.commandBus.execute<GameQuizGetByIdCommand, QuizGameInfo>(new GameQuizGetByIdCommand(id, tokenLoad.id));

    return game;
  }

  @Post("pairs/connection")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async ConnectToGame(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {
    let newGame = await this.commandBus.execute<QuizGameConnectToGameCommand, QuizGameInfo>(
      new QuizGameConnectToGameCommand(tokenLoad.id, tokenLoad.login),
    );

    return newGame;
  }
}
