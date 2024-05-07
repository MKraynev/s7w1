import { ForbiddenException, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameInfo } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { GamesRepoEntity } from "../../repo/entities/GamesRepoEntity";
import { UsersRepoService } from "../../../../../users/repo/UsersRepoService";

export class QuizGameConnectToGameCommand {
  constructor(
    public userId: string,
    public userLogin: string,
  ) {}
}

@CommandHandler(QuizGameConnectToGameCommand)
@Injectable()
export class QuizGameConnectToGameUseCase implements ICommandHandler<QuizGameConnectToGameCommand, QuizGameInfo> {
  constructor(private gameRepo: GamesRepoService) {}

  async execute(command: QuizGameConnectToGameCommand): Promise<QuizGameInfo> {
    console.log("User ->", command.userId, command.userLogin);

    let userCurrentGame = await this.gameRepo.GetUserCurrentGame(command.userId);
    if (userCurrentGame) throw new ForbiddenException("Player already got active game");

    let activeSearchingGame = await this.gameRepo.GetSearchingGame();

    if (activeSearchingGame) {
      activeSearchingGame.TakeSecondPlayer(+command.userId); //changed to active game
      let savedActivePlayingGame = await this.gameRepo.Save(activeSearchingGame);
      return QuizGameInfo.InitGame(savedActivePlayingGame);
    }

    let newGame = await this.gameRepo.CreateGame(+command.userId);
    let newQuizGame = QuizGameInfo.InitNewGame(newGame.id.toString(), command.userId, command.userLogin, newGame.createdAt);

    return newQuizGame;
  }
}
