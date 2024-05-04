import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { GamesRepoEntity } from "../repo/entities/GamesRepoEntity";
import { QuizGameInfo } from "./entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { JwtAuthGuard } from "../../../../../guards/common/JwtAuthGuard";
import { JwtServiceUserAccessTokenLoad } from "../../../../../jwt/entities/JwtServiceAccessTokenLoad";
import { ReadAccessToken } from "../../../../../jwt/decorators/JwtRequestReadAccessToken";
import { GameQuizGetMyCurrentCommand } from "../service/use-cases/game.quiz.get.my.current.usecase";
import { QuizGameConnectToGameCommand } from "../service/use-cases/game.quiz.connection.usecase";

@Controller("pair-game-quiz")
export class GamesPairGameQuizController {
  constructor(private commandBus: CommandBus) {}
  @Get("pairs/my-current")
  @UseGuards(JwtAuthGuard)
  public async GetCurrentUserGame(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {
    let game = await this.commandBus.execute<GameQuizGetMyCurrentCommand, GamesRepoEntity>(
      new GameQuizGetMyCurrentCommand(tokenLoad.id),
    );

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
