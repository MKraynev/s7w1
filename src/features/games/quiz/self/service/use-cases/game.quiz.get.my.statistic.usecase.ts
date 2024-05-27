import { Injectable, Scope } from "@nestjs/common";
import { JwtServiceUserAccessTokenLoad } from "../../../../../../jwt/entities/JwtServiceAccessTokenLoad";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesRepoService } from "../../repo/GamesRepoService";

export class GameQuizGetMyStatisticCommand {
  constructor(public userToken: JwtServiceUserAccessTokenLoad) {}
}

@Injectable()
@CommandHandler(GameQuizGetMyStatisticCommand)
export class GameQuizGetMyStatisticUseCase
  implements
    ICommandHandler<
      GameQuizGetMyStatisticCommand,
      { sumScore: number; avgScores: number; gamesCount: number; winsCount: number; lossesCount: number; drawsCount: number }
    >
{
  constructor(private gameRepo: GamesRepoService) {}

  async execute(
    command: GameQuizGetMyStatisticCommand,
  ): Promise<{ sumScore: number; avgScores: number; gamesCount: number; winsCount: number; lossesCount: number; drawsCount: number }> {
    let [sscore, gcount, wcount, lcount, dcount] = await Promise.all([
      await this.gameRepo.GetUserAllScores(command.userToken.id),
      await this.gameRepo.CountPlayerGames(command.userToken.id),
      await this.gameRepo.CountPlayerWinGames(command.userToken.id),
      await this.gameRepo.CountPlayerLoseGames(command.userToken.id),
      await this.gameRepo.CountPlayerDrawGames(command.userToken.id),
    ]);
    console.log("found values", sscore, gcount, wcount, lcount, dcount);
    return {
      sumScore: sscore,
      avgScores: gcount !== 0 ? +(sscore / gcount).toFixed(2).replace(".00", "") : 0,
      gamesCount: gcount,
      winsCount: wcount,
      lossesCount: lcount,
      drawsCount: dcount,
    };
  }
}
