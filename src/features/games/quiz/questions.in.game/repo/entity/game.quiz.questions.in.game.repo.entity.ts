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
  @Column({ nullable: true })
  gameId: number;

  @ManyToOne(() => QuizQuestionEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "questionId" })
  question: QuizQuestionEntity;
  @Column({ nullable: true })
  questionId: number;

  @Column()
  orderNum: number;

  public static Init(gameId: string, questionId: string, orderNum: number) {
    let res = new GameQuizQuestionsInGameRepoEntity();
    res.gameId = +gameId;
    res.questionId = +questionId;
    res.orderNum = orderNum;

    return res;
  }
}
