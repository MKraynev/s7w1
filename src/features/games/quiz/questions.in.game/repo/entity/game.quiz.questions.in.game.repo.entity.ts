import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { QuizQuestionEntity } from "../../../questions/repo/entity/QuestionsRepoEntity";
import { GamesRepoEntity } from "../../../self/repo/entities/GamesRepoEntity";
@Entity("QuizGameQuestion")
export class GameQuizQuestionsInGameRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GamesRepoEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "gameId" })
  game: GamesRepoEntity;

  @Column()
  gameId: number;

  @ManyToOne(() => QuizQuestionEntity)
  @JoinColumn({ name: "questionId" })
  question: QuizQuestionEntity;

  @Column({ nullable: false })
  questionId: number;

  @Column()
  orderNum: number;
}
