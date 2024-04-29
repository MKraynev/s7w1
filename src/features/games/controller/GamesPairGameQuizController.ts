import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/guards/common/JwtAuthGuard';
import { ReadAccessToken } from 'src/jwt/decorators/JwtRequestReadAccessToken';
import { JwtServiceUserAccessTokenLoad } from 'src/jwt/entities/JwtServiceAccessTokenLoad';
import { GamesRepoEntity } from '../repo/entities/GamesRepoEntity';
import { QuizGameMyCurrentCommand } from '../use-cases/QuizGameMyCurrentUsecase';
import { QuizGameConnectToGameCommand } from '../use-cases/QuizGameConnectToGameUsecase';
import { QuizGameInfo } from './entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity';

@Controller('pair-game-quiz')
export class GamesPairGameQuizController {
  constructor(private commandBus: CommandBus) {}
  @Get('pairs/my-current')
  @UseGuards(JwtAuthGuard)
  public async GetCurrentUserGame(
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    let game = await this.commandBus.execute<
      QuizGameMyCurrentCommand,
      GamesRepoEntity
    >(new QuizGameMyCurrentCommand(tokenLoad.id));

    return game;
  }

  @Post('pairs/connection')
  @UseGuards(JwtAuthGuard)
  public async ConnectToGame(
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    let newGame = await this.commandBus.execute<
      QuizGameConnectToGameCommand,
      QuizGameInfo
    >(new QuizGameConnectToGameCommand(tokenLoad.id, tokenLoad.login));

    return newGame;
  }
}
