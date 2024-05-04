import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('QuizQuestions')
export class QuizQuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'character varying', length: 500 })
  body: string;

  @Column({
    type: 'character varying',
    array: true,
    length: 50,
    nullable: false,
  })
  correctAnswers: string[];

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public static Init(
    body: string,
    answers: string[],
    published: boolean = false,
  ) {
    let res = new QuizQuestionEntity();
    res.body = body;
    res.correctAnswers = answers;
    res.published = published;

    return res;
  }

  public GetWithStringId() {
    let updateVal =
      this.updatedAt.toISOString() === this.createdAt.toISOString()
        ? null
        : this.updatedAt.toISOString();

    return Object.assign({}, this, {
      id: this.id.toString(),
      updatedAt: updateVal,
    });
  }
}
