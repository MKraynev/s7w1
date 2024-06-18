import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GamesRepoEntity } from "./GamesRepoEntity";

@Entity("ClosingQuizGame")
export class GameQuizClosingGameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => GamesRepoEntity)
  @JoinColumn({ name: "gameId" })
  game: GamesRepoEntity;

  @Column({ nullable: true })
  gameId: number;

  @Column({ type: "bigint" })
  createdAt_milliseconds: number;

  public static Init(game: GamesRepoEntity) {
    let result = new GameQuizClosingGameEntity();

    result.game = game;
    result.gameId = game.id;
    result.createdAt_milliseconds = Date.now();
    console.log("game ->", result);

    return result;
  }
}
