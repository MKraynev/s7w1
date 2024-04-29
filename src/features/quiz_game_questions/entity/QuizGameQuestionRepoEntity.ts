import { GamesRepoEntity } from 'src/features/games/repo/entities/GamesRepoEntity';
import { QuizQuestionEntity } from 'src/features/questions/repo/entity/QuestionsRepoEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('QuizGameQuestion')
export class QuizGameQuestionRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GamesRepoEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: GamesRepoEntity;

  @Column()
  gameId: number;

  @ManyToOne(() => QuizQuestionEntity)
  @JoinColumn({ name: 'questionId' })
  question: QuizQuestionEntity;

  @Column({ nullable: false })
  questionId: number;

  @Column()
  orderNum: number;
}
