import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserRepoEntity } from "../../../../../users/repo/entities/UsersRepoEntity";

export enum QuizGameStatus {
  win,
  lose,
  draw,
}

@Entity("GameQuizWinner")
export class GameQuizWinnerRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserRepoEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "playerId" })
  player: UserRepoEntity;
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
    let winner = new GameQuizWinnerRepoEntity();

    winner.playerId = id;
    winner.sumScore = 0;
    winner.avgScores = 0;
    winner.gamesCount = 0;
    winner.winsCount = 0;
    winner.lossesCount = 0;
    winner.drawsCount = 0;

    return winner;
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
