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
import { GameQuizQuestionsInGameRepoEntity } from "../../../questions.in.game/repo/entity/game.quiz.questions.in.game.repo.entity";
import { QuizQuestionEntity } from "../../../questions/repo/entity/QuestionsRepoEntity";

@Entity("Games")
export class GamesRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserRepoEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "player_1_id" })
  player_1: UserRepoEntity;
  @Column({ nullable: true })
  player_1_id: number;

  @OneToMany(() => QuizGameAnswerRepoEntity, (answer) => answer.game)
  answers_p1: QuizGameAnswerRepoEntity[];

  @Column({ nullable: true })
  player_1_answerCount: number;

  @Column({ nullable: true })
  player_1_score: number;

  @ManyToOne(() => UserRepoEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "player_2_id" })
  player_2: UserRepoEntity;
  @Column({ nullable: true })
  player_2_id: number;

  @OneToMany(() => QuizGameAnswerRepoEntity, (answer) => answer.game)
  answers_p2: QuizGameAnswerRepoEntity[];

  @Column({ nullable: true })
  player_2_answerCount: number;

  @Column({ nullable: true })
  player_2_score: number;

  @ManyToOne(() => GameQuizQuestionsInGameRepoEntity, { nullable: true })
  questions: GameQuizQuestionsInGameRepoEntity[];

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

  public questionEntities: QuizQuestionEntity[] = [];

  public static Init(hostPlayerId: number, fill = true) {
    let game = new GamesRepoEntity();

    if (fill) game.player_1_id = hostPlayerId;
    game.status = "PendingSecondPlayer";

    return game;
  }

  public static QuestionCount = () => 5;
}
