import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
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

@Controller("pair-game-quiz")
export class GamesPairGameQuizController {
  constructor(private commandBus: CommandBus) {}
  @Get("pairs/my-current")
  @UseGuards(JwtAuthGuard)
  public async GetCurrentUserGame(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {
    let game = await this.commandBus.execute<GameQuizGetMyCurrentCommand, GamesRepoEntity>(new GameQuizGetMyCurrentCommand(tokenLoad.id));

    return game;
  }

  @Get("pairs/:id")
  @UseGuards(JwtAuthGuard)
  public async GetById(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad, @Param("id") id: string) {
    let game = await this.commandBus.execute<GameQuizGetByIdCommand, QuizGameComplexInfo>(new GameQuizGetByIdCommand(id, tokenLoad.id));

    return game;
  }

  @Post("pairs/connection")
  @UseGuards(JwtAuthGuard)
  public async ConnectToGame(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {
    let newGame = await this.commandBus.execute<QuizGameConnectToGameCommand, QuizGameInfo>(
      new QuizGameConnectToGameCommand(tokenLoad.id, tokenLoad.login),
    );

    return newGame;
  }
}