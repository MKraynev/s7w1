import { Injectable } from "@nestjs/common";
import { FindOptionsOrder, Repository } from "typeorm";
import { GameQuizPlayerRepoEntity, QuizGameStatus } from "./entity/game.quiz.winner.repo.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class GameQuizWinnersRepoService {
  constructor(
    @InjectRepository(GameQuizPlayerRepoEntity)
    private repo: Repository<GameQuizPlayerRepoEntity>,
  ) {}

  public async Update(userId: number, gameStatus: QuizGameStatus, scores: number) {
    let winner = await this.repo.findOne({ where: { playerId: userId } });

    if (!winner) winner = GameQuizPlayerRepoEntity.Init(userId);

    winner.AddScores(scores, gameStatus);

    return this.repo.save(winner);
  }

  public async CountAndReadMany(
    sorts: {
      sortBy: keyof GameQuizPlayerRepoEntity;
      sortDirection: "asc" | "desc";
    }[] = [{ sortBy: "avgScores", sortDirection: "desc" }],
    skip: number = 0,
    limit: number = 10,
    loadUser: boolean = true,
  ): Promise<{
    count: number;
    winners: GameQuizPlayerRepoEntity[];
  }> {
    let orderObj: FindOptionsOrder<GameQuizPlayerRepoEntity> = {};
    sorts.forEach((sort) => (orderObj[sort.sortBy.toString()] = sort.sortDirection));

    console.log("top orderObj", orderObj);

    let [winners, winnersCount] = await this.repo.findAndCount({
      order: orderObj,
      skip: skip,
      take: limit,
      relations: { user: loadUser },
    });

    return { count: winnersCount, winners: winners };
  }
  public async DeleteAll() {
    await this.repo.delete({});
  }
}
