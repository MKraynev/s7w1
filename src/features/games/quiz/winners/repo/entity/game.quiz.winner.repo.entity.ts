import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserRepoEntity } from "../../../../../users/repo/entities/UsersRepoEntity";
import { GamesRepoEntity } from "../../../self/repo/entities/GamesRepoEntity";

export enum QuizGameStatus {
  win,
  lose,
  draw,
}

@Entity("GameQuizPlayer")
export class GameQuizPlayerRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserRepoEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "playerId" })
  user: UserRepoEntity;
  @Column({ nullable: true })
  playerId: number;

  @Column()
  sumScore: number;

  @Column()
  avgScores: number;

  @Column()
  gamesCount: number;

  @Column()
  winsCount: number;

  @Column()
  lossesCount: number;

  @Column()
  drawsCount: number;

  public static Init(id: number) {
    let player = new GameQuizPlayerRepoEntity();

    player.playerId = id;
    player.sumScore = 0;
    player.avgScores = 0;
    player.gamesCount = 0;
    player.winsCount = 0;
    player.lossesCount = 0;
    player.drawsCount = 0;

    return player;
  }

  public AddScores(scores: number, gameStatus: QuizGameStatus) {
    this.sumScore += scores;
    this.gamesCount += 1;

    switch (gameStatus) {
      case QuizGameStatus.win:
        this.winsCount += 1;
        break;

      case QuizGameStatus.draw:
        this.drawsCount += 1;
        break;

      case QuizGameStatus.lose:
        this.lossesCount += 1;
        break;
    }

    this.avgScores = +(this.sumScore / this.gamesCount).toFixed(2).replace(".00", "");
  }
}
