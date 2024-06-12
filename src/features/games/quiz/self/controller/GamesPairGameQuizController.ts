import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { GamesRepoEntity } from "../repo/entities/GamesRepoEntity";
import { QuizGameInfo } from "./entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { JwtAuthGuard } from "../../../../../guards/common/JwtAuthGuard";
import { JwtServiceUserAccessTokenLoad } from "../../../../../jwt/entities/JwtServiceAccessTokenLoad";
import { ReadAccessToken } from "../../../../../jwt/decorators/JwtRequestReadAccessToken";
import { GameQuizGetMyCurrentCommand } from "../service/use-cases/game.quiz.get.my.current.usecase";
import { QuizGameConnectToGameCommand } from "../service/use-cases/game.quiz.connection.usecase";
import { GameQuizGetByIdCommand } from "../service/use-cases/game.quiz.get.by.id.usecase";
import { ValidateParameters } from "../../../../../pipes/ValidationPipe";
import { GameQuizAnswerTheQuestionCommand } from "../service/use-cases/game.quiz.answer.the.question.usecase";
import { QuizGameAnswerResult } from "../service/entities/quiz.game.answer.result";
import { QueryPaginator } from "../../../../../paginator/QueryPaginatorDecorator";
import { InputPaginator } from "../../../../../paginator/entities/QueryPaginatorInputEntity";
import { GameQuizGetPairsMyCommand, GameQuizGetPairsMyUseCase } from "../service/use-cases/game.quiz.get.pairs.my.usecase";
import { OutputPaginator } from "../../../../../paginator/entities/QueryPaginatorUutputEntity";
import { GameQuizGetMyStatisticCommand } from "../service/use-cases/game.quiz.get.my.statistic.usecase";
import { GameQuizGetUsersTopCommand } from "../service/use-cases/game.quiz.get.users.top.usecase";
import { GameQuizPlayerRepoEntity } from "../../winners/repo/entity/game.quiz.winner.repo.entity";

@Controller("pair-game-quiz")
export class GamesPairGameQuizController {
  constructor(private commandBus: CommandBus) {}

  @Get("users/top")
  public async GetTopUsers(@Query("sort") sort: string[], @QueryPaginator() paginator: InputPaginator) {
    //input data: undefined [ 'sumScore desc', 'avgScores desc' ]
    let sortUnits: { sortBy: keyof GameQuizPlayerRepoEntity; sortDirection: "asc" | "desc" }[] = [];
    let availableKeys = ["sumScore", "avgScores", "gamesCount", "winsCount", "lossesCount", "drawsCount"];
    let availableDir = ["asc", "desc"];

    console.log("input sort data:", sort);

    sort.forEach((s) => {
      let [key, dir] = s.split(" ");
      if (!availableKeys.includes(key)) return;
      if (!availableDir.includes(dir)) return;

      sortUnits.push({ sortBy: key as keyof GameQuizPlayerRepoEntity, sortDirection: dir as "asc" | "desc" });
    });

    console.log("sortUnits:", sortUnits);

    let data = await this.commandBus.execute<GameQuizGetUsersTopCommand, { count: number; winners: Array<GameQuizPlayerRepoEntity> }>(
      new GameQuizGetUsersTopCommand({ sorter: sortUnits, skip: paginator.skipElements, limit: paginator.pageSize }),
    );

    console.log("data", data);

    return new OutputPaginator(data.count, data.winners, paginator);
  }

  @Get("pairs/my")
  @UseGuards(JwtAuthGuard)
  public async GetAllMyGames(
    @ReadAccessToken() token: JwtServiceUserAccessTokenLoad,
    @Query("sortBy") sortBy: keyof GamesRepoEntity = "startedAt",
    @Query("sortDirection") sortDirecrion: "desc" | "asc" = "desc",
    @QueryPaginator() paginator: InputPaginator,
  ) {
    console.log("input values:", token, sortBy, sortDirecrion, paginator);

    let games = await this.commandBus.execute<GameQuizGetPairsMyCommand, { count: number; games: QuizGameInfo[] }>(
      new GameQuizGetPairsMyCommand(token, {
        sortBy: sortBy,
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
    console.log("input values:", token);
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
    console.log("Input values:", token, userResponse);

    try {
      let answerResult = await this.commandBus.execute<GameQuizAnswerTheQuestionCommand, QuizGameAnswerResult>(
        new GameQuizAnswerTheQuestionCommand(token.id, token.login, userResponse.answer),
      );

      return answerResult;
    } catch (e) {
      console.log(e);
      throw new ForbiddenException();
    }
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
    console.log("input data:", tokenLoad);

    let newGame = await this.commandBus.execute<QuizGameConnectToGameCommand, QuizGameInfo>(
      new QuizGameConnectToGameCommand(tokenLoad.id, tokenLoad.login),
    );

    return newGame;
  }
}
