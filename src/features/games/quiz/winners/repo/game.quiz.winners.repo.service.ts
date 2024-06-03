import { Injectable } from "@nestjs/common";
import { FindOptionsOrder, Repository } from "typeorm";
import { GameQuizWinnerRepoEntity, QuizGameStatus } from "./entity/game.quiz.winner.repo.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class GameQuizWinnersRepoService {
  constructor(
    @InjectRepository(GameQuizWinnerRepoEntity)
    private repo: Repository<GameQuizWinnerRepoEntity>,
  ) {}

  public async Update(userId: number, gameStatus: QuizGameStatus, scores: number) {
    let winner = await this.repo.findOne({ where: { playerId: userId } });

    if (!winner) winner = GameQuizWinnerRepoEntity.Init(userId);

    winner.AddScores(scores, gameStatus);

    return this.repo.save(winner);
  }

  public async CountAndReadMany(
    sorts: {
      sortBy: keyof GameQuizWinnerRepoEntity;
      sortDirection: "asc" | "desc";
    }[] = [{ sortBy: "avgScores", sortDirection: "desc" }],
    skip: number = 0,
    limit: number = 10,
    loadUser: boolean = true,
  ): Promise<{
    count: number;
    winners: GameQuizWinnerRepoEntity[];
  }> {
    let orderObj: FindOptionsOrder<GameQuizWinnerRepoEntity> = {};
    sorts.forEach((sort) => (orderObj[sort.sortBy.toString()] = sort.sortDirection));

    let [winners, winnersCount] = await this.repo.findAndCount({
      order: orderObj,
      skip: skip,
      take: limit,
      relations: { player: loadUser },
    });

    return { count: winnersCount, winners: winners };
  }
  public async DeleteAll() {
    await this.repo.delete({});
  }
}
