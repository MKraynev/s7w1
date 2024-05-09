import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GamesRepoEntity } from "../../../self/repo/entities/GamesRepoEntity";
import { UserRepoEntity } from "../../../../../users/repo/entities/UsersRepoEntity";
import { QuizQuestionEntity } from "../../../questions/repo/entity/QuestionsRepoEntity";

export type AnswerStatus = "correct" | "incorrect";

@Entity("Answers")
export class QuizGameAnswerRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 50 })
  answer: string;

  @ManyToOne(() => UserRepoEntity, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: UserRepoEntity;
  @Column()
  userId: number;

  @ManyToOne(() => QuizQuestionEntity)
  @JoinColumn()
  question: QuizQuestionEntity;
  @Column()
  questionId: number;

  @ManyToOne(() => GamesRepoEntity, { nullable: true, onDelete: "CASCADE" })
  game: GamesRepoEntity;
  @Column({ nullable: true })
  gameId: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  public static Init(gameId: string, questionId: string, playerId: string, answer: string) {
    let res = new QuizGameAnswerRepoEntity();
    res.answer = answer;
    res.userId = +playerId;
    res.gameId = +gameId;
    res.questionId = +questionId;

    return res;
  }
}
