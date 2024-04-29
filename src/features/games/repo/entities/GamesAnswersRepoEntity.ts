import { QuizQuestionEntity } from 'src/features/questions/repo/entity/QuestionsRepoEntity';
import { UserRepoEntity } from 'src/features/users/repo/entities/UsersRepoEntity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GamesRepoEntity } from './GamesRepoEntity';

export type AnswerStatus = 'correct' | 'incorrect';

@Entity('Answers')
export class QuizGameAnswerRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 50 })
  answer: string;

  @ManyToOne(() => UserRepoEntity, {
    nullable: true,
    onDelete: 'CASCADE',
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

  @ManyToOne(() => GamesRepoEntity, { nullable: true, onDelete: 'CASCADE' })
  game: GamesRepoEntity;
  @Column({ nullable: true })
  gameId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
