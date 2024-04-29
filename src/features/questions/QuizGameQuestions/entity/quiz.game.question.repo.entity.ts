import { GamesRepoEntity } from 'src/features/games/repo/entities/GamesRepoEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizQuestionEntity } from '../../repo/entity/QuestionsRepoEntity';
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
