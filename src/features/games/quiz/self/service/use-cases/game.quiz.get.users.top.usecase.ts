import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtServiceUserAccessTokenLoad } from "../../../../../../jwt/entities/JwtServiceAccessTokenLoad";
import { Injectable } from "@nestjs/common";
import { GameQuizWinnersRepoService } from "../../../winners/repo/game.quiz.winners.repo.service";
import { GameQuizPlayerRepoEntity } from "../../../winners/repo/entity/game.quiz.winner.repo.entity";
import { count } from "console";
type PlayerStatistic = {
  sumScore: number;
  avgScores: number;
  gamesCount: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;
};

export class GameQuizGetUsersTopCommand {
  constructor(
    public paginator: {
      sorter: { sortBy: keyof GameQuizPlayerRepoEntity; sortDirection: "desc" | "asc" }[];
      skip: number;
      limit: number;
    },
  ) {}
}

@Injectable()
@CommandHandler(GameQuizGetUsersTopCommand)
export class GameQuizGetUsersTopUseCase
  implements ICommandHandler<GameQuizGetUsersTopCommand, { count: number; winners: Array<GameQuizPlayerRepoEntity> }>
{
  constructor(private winnersRepo: GameQuizWinnersRepoService) {}

  async execute(command: GameQuizGetUsersTopCommand): Promise<{ count: number; winners: Array<GameQuizPlayerRepoEntity> }> {
    let winners = await this.winnersRepo.CountAndReadMany(command.paginator.sorter, command.paginator.skip, command.paginator.limit);

    let result = {
      count: winners.count,
      winners: winners.winners.map((winner) => {
        // Object.defineProperty(winner, "player", { value: { id: winner.user.id.toString(), login: winner.user.login } });

        winner["player"] = {
          id: winner.user.id.toString(),
          login: winner.user.login,
        };

        delete winner.user;
        delete winner.playerId;
        delete winner.id;

        return winner;
      }),
    };

    return result;
  }
}