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

@Controller("pair-game-quiz")
export class GamesPairGameQuizController {
  constructor(private commandBus: CommandBus) {}
  @Get("pairs/my-current")
  @UseGuards(JwtAuthGuard)
  public async GetCurrentUserGame(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {
    console.log("token ->", tokenLoad);
    let game = await this.commandBus.execute<GameQuizGetMyCurrentCommand, GamesRepoEntity>(new GameQuizGetMyCurrentCommand(tokenLoad.id));

    console.log("result", game);

    return game;
  }

  @Post("pairs/my-current/answers")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async SendAnswer(
    @ReadAccessToken() token: JwtServiceUserAccessTokenLoad,
    @Body(new ValidateParameters()) userResponse: { answer: string },
  ) {
    try {
      let answerResult = await this.commandBus.execute<GameQuizAnswerTheQuestionCommand, QuizGameAnswerResult>(
        new GameQuizAnswerTheQuestionCommand(token.id, token.login, userResponse.answer),
      );

      console.log("result", answerResult);

      return answerResult;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Get("pairs/:id")
  @UseGuards(JwtAuthGuard)
  public async GetById(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad, @Param("id") id: string) {
    console.log("token ->", tokenLoad);
    let game = await this.commandBus.execute<GameQuizGetByIdCommand, QuizGameInfo>(new GameQuizGetByIdCommand(id, tokenLoad.id));

    console.log('@Get("pairs/:id") ->', game);

    return game;
  }

  @Post("pairs/connection")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async ConnectToGame(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {
    let newGame = await this.commandBus.execute<QuizGameConnectToGameCommand, QuizGameInfo>(
      new QuizGameConnectToGameCommand(tokenLoad.id, tokenLoad.login),
    );

    console.log('@Post("pairs/connection") ->', newGame);

    return newGame;
  }
}
