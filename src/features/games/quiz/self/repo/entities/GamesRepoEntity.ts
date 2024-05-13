import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { QuizGameAnswerRepoEntity } from "../../../answers/repo/entities/GamesAnswersRepoEntity";
import { QuizGameStatus } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameStatusEnum";
import { UserRepoEntity } from "../../../../../users/repo/entities/UsersRepoEntity";

@Entity("Games")
export class GamesRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserRepoEntity, { nullable: true })
  @JoinColumn({ name: "player_1_id" })
  player_1: UserRepoEntity;
  @Column({ nullable: true })
  player_1_id: number;

  @ManyToOne(() => UserRepoEntity, { nullable: true })
  @JoinColumn({ name: "player_2_id" })
  player_2: UserRepoEntity;
  @Column({ nullable: true })
  player_2_id: number;

  @OneToMany(() => QuizGameAnswerRepoEntity, (answer) => answer.game)
  answers_p1: QuizGameAnswerRepoEntity[];

  @OneToMany(() => QuizGameAnswerRepoEntity, (answer) => answer.game)
  answers_p2: QuizGameAnswerRepoEntity[];

  @Column({ nullable: true })
  player_1_score: number;

  @Column({ nullable: true })
  player_2_score: number;

  @Column({ nullable: false })
  status: QuizGameStatus;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  public static Init(hostPlayerId: number, status: QuizGameStatus = "PendingSecondPlayer") {
    let game = new GamesRepoEntity();

    game.player_1_id = hostPlayerId;
    game.status = status;

    return game;
  }
}
