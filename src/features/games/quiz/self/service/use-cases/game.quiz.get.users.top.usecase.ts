import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtServiceUserAccessTokenLoad } from "../../../../../../jwt/entities/JwtServiceAccessTokenLoad";
import { Injectable } from "@nestjs/common";
import { GameQuizWinnersRepoService } from "../../../winners/repo/game.quiz.winners.repo.service";
import { GameQuizPlayerRepoEntity } from "../../../winners/repo/entity/game.quiz.winner.repo.entity";
import { count } from "console";
import { DataSource } from "typeorm";
export type PlayerStatistic = {
  player: { id: string; login: string };
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
  implements ICommandHandler<GameQuizGetUsersTopCommand, { count: number; winners: Array<PlayerStatistic> }>
{
  constructor(private playersRepo: GameQuizWinnersRepoService) {}

  async execute(command: GameQuizGetUsersTopCommand): Promise<{ count: number; winners: Array<PlayerStatistic> }> {
    let users = await this.playersRepo.CountAndReadMany(command.paginator.sorter, command.paginator.skip, command.paginator.limit);
    return {
      count: users.count,
      winners: users.winners.map((player) => {
        let { id, user, playerId, ...rest } = player;

        let result: PlayerStatistic = { ...rest, player: { id: id.toString(), login: user.login } };
        return result;
      }),
    };
  }
}
