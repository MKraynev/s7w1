import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, FindManyOptions, FindOptionsOrder, Repository } from "typeorm";
import { GamesRepoEntity } from "./entities/GamesRepoEntity";
import { QuizGameInfo } from "../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

export class GamesRepoService {
  constructor(
    @InjectRepository(GamesRepoEntity)
    private repo: Repository<GamesRepoEntity>,
    @InjectDataSource() public dataSource: DataSource,
  ) {}

  public async CreateGame(userId: number) {
    let game = GamesRepoEntity.Init(userId);
    let savedGame = await this.repo.save(game);
    return savedGame;
  }

  public async CountAndReadManyByUserId(
    userId: string,
    sortBy: keyof GamesRepoEntity = "startedAt",
    sortDirection: "asc" | "desc" = "desc",
    skip: number = 0,
    limit: number = 10,
  ): Promise<{
    count: number;
    games: GamesRepoEntity[];
  }> {
    let orderObj: FindOptionsOrder<GamesRepoEntity> = {};
    orderObj[sortBy] = sortDirection;

    let userId_num = +userId;

    if (isNaN(userId_num)) throw new NotFoundException();
    let wherePattern = [{ player_1_id: userId_num }, { player_2_id: userId_num }];

    let count = await this.repo.count({ where: wherePattern });

    console.log("repo params:", wherePattern, orderObj, skip, limit);
    let games = await this.repo.find({
      where: wherePattern,
      order: orderObj,
      skip: skip,
      take: limit,
    });
    console.log("found:", games);
    return { count: count, games: games };
  }

  public async CountPlayerWinGames(userId: string) {
    let winAsFirstPlayerCount = await this.repo
      .createQueryBuilder("game")
      .where("game.player_1_id = :id", { id: userId })
      .andWhere("game.player_1_score > game.player_2_score")
      .andWhere("game.status = :status", { status: "Finished" })
      .getCount();

    let winAsSecondPlayerCount = await this.repo
      .createQueryBuilder("game")
      .where("game.player_2_id = :id", { id: userId })
      .andWhere("game.player_2_score > game.player_1_score")
      .andWhere("game.status = :status", { status: "Finished" })
      .getCount();

    return winAsFirstPlayerCount + winAsSecondPlayerCount;
  }

  public async CountPlayerLoseGames(userId: string) {
    let loseAsFirstCount = await this.repo
      .createQueryBuilder("game")
      .where("game.player_1_id = :id", { id: userId })
      .andWhere("game.player_1_score < game.player_2_score")
      .andWhere("game.status = :status", { status: "Finished" })
      .getCount();

    let loseAsSecondCount = await this.repo
      .createQueryBuilder("game")
      .where("game.player_2_id = :id", { id: userId })
      .andWhere("game.player_2_score < game.player_1_score")
      .andWhere("game.status = :status", { status: "Finished" })
      .getCount();

    return loseAsFirstCount + loseAsSecondCount;
  }

  public async CountPlayerDrawGames(userId: string) {
    return await this.repo
      .createQueryBuilder("game")
      .where(
        new Brackets((qb) => {
          qb.where("game.player_1_id = :id", { id: userId }).orWhere("game.player_2_id = :id", { id: userId });
        }),
      )
      .andWhere("game.status = :status", { status: "Finished" })
      .andWhere("game.player_1_score = game.player_2_score")
      .getCount();
  }

  public async CountPlayerGames(userId: string) {
    return await this.repo
      .createQueryBuilder("game")
      .where(
        new Brackets((qb) => {
          qb.where("game.player_1_id = :id", { id: userId }).orWhere("game.player_2_id = :id", { id: userId });
        }),
      )
      .getCount();
  }

  public async GetUserAllScores(userId: string) {
    let scoresAsFirst = await this.repo
      .createQueryBuilder("game")
      .where("game.player_1_id = :id", { id: userId })
      .select("SUM(game.player_1_score)")
      .getRawOne();

    let scoresAsSecond = await this.repo
      .createQueryBuilder("game")
      .where("game.player_2_id = :id", { id: userId })
      .select("SUM(game.player_2_score)")
      .getRawOne();

    return (+scoresAsFirst.sum | 0) + (+scoresAsSecond.sum | 0);
  }

  public async GetUserCurrentGame(userId: string): Promise<GamesRepoEntity> {
    let gameInfo = await this.repo
      .createQueryBuilder("game")
      .where(
        new Brackets((qb) => {
          qb.where("game.status = :active", { active: "Active" }).orWhere("game.status = :pending", { pending: "PendingSecondPlayer" });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where("game.player_1_id = :id", { id: userId }).orWhere("game.player_2_id = :id", { id: userId });
        }),
      )
      .getOne();

    return gameInfo;
  }

  public async FindOneById(gameId: string, takeAsCompleteEntity: boolean = false): Promise<GamesRepoEntity | null> {
    let gameId_num = +gameId;

    if (isNaN(gameId_num)) throw new BadRequestException();

    //TODO обрезать сущность user, чтобы не возвращать salt и прочее
    return await this.repo.findOne({
      where: { id: gameId_num },
      relations: {
        player_1: takeAsCompleteEntity,
        player_2: takeAsCompleteEntity,
        answers_p1: takeAsCompleteEntity,
        answers_p2: takeAsCompleteEntity,
      },
    });
  }

  public async GetSearchingGame(exceptId: string): Promise<GamesRepoEntity | null> {
    let searchingGame = (
      await this.dataSource.query(`
    SELECT 
      "game"."id" AS "id", 
      "game"."player_1_id" AS "player_1_id", 
      "game"."player_2_id" AS "player_2_id", 
      "game"."player_1_score" AS "player_1_score", 
      "game"."player_2_score" AS "player_2_score", 
      "game"."status" AS "status", 
      "game"."createdAt" AS "createdAt", 
      "game"."startedAt" AS "startedAt", 
      "game"."endedAt" AS "endedAt", 
      "game"."updatedAt" AS "updatedAt" 
    FROM public."Games" "game" 
      WHERE "game"."status" = 'PendingSecondPlayer'
      AND "game"."player_1_id" != ${exceptId}
    LIMIT 1
    `)
    )[0] as GamesRepoEntity | null;

    //searchingGame = Object.assign(new GamesRepoEntity(), searchingGame);

    return searchingGame;
  }

  public async Save(game: GamesRepoEntity) {
    return await this.repo.save(game);
  }

  public async DeleteAll() {
    await this.repo.delete({});
  }
}
