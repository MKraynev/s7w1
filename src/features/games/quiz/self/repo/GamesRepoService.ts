import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, FindManyOptions, Repository } from "typeorm";
import { GamesRepoEntity } from "./entities/GamesRepoEntity";
import { QuizGameInfo } from "../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { BadRequestException } from "@nestjs/common";

export class GamesRepoService {
  constructor(
    @InjectRepository(GamesRepoEntity)
    private repo: Repository<GamesRepoEntity>,
    @InjectDataSource() public dataSource: DataSource,
  ) {}

  public async CreateGame(userId: number) {
    //TODO сделать создание игры
    let game = GamesRepoEntity.Init(userId);
    let savedGame = await this.repo.save(game);
    return savedGame;
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

    console.log("repo, id search ->", gameId);

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

    return searchingGame;
  }

  public async Save(game: GamesRepoEntity) {
    return await this.repo.save(game);
  }

  public async DeleteAll() {
    await this.repo.delete({});
  }
}
