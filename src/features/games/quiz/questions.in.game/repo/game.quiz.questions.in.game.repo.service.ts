import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { QuizGameQuestionsExtendedInfoEntity } from "../../self/repo/entities/QuizGameQuestionsExtendedInfoEntity";
import { GameQuizQuestionsInGameRepoEntity } from "./entity/game.quiz.questions.in.game.repo.entity";
import { GameQuizAnswersRepoService } from "../../answers/repo/game.quiz.answers.repo.service";
import { QuizQuestionRepoService } from "../../questions/repo/QuestionsRepoService";

export class GameQuizQuestionsInGameService {
  constructor(
    @InjectDataSource() public dataSource: DataSource,
    @InjectRepository(GameQuizQuestionsInGameRepoEntity) private repo: Repository<GameQuizQuestionsInGameRepoEntity>,
    private answersRepo: GameQuizAnswersRepoService,
    private questionRepo: QuizQuestionRepoService,
  ) {}

  public async GetGameQuestionsInfoOrdered(gameId: string | number, user_1_id: string | number, user_2_id: string | number) {
    let gameQuestions = await this.repo.find({ where: { gameId: +gameId } });
    let p1_answers = await this.answersRepo.GetUserAnswers(user_1_id.toString(), gameId.toString());
    let p2_answers = await this.answersRepo.GetUserAnswers(user_2_id.toString(), gameId.toString());
    let questions = await this.questionRepo.FindQuestions(gameQuestions.map((gq) => gq.questionId));

    let exInfo = gameQuestions.map((gq) => {
      let question = questions.find((q) => q.id === gq.questionId);
      let p1_answer = p1_answers.find((pa) => +pa.questionId === gq.questionId);
      let p2_answer = p2_answers.find((pa) => +pa.questionId === gq.questionId);

      return new QuizGameQuestionsExtendedInfoEntity(
        question.id,
        question.body,
        question.correctAnswers,
        gq.orderNum,
        p1_answer.answer,
        p1_answer.createdAt,
        p2_answer.answer,
        p2_answer.createdAt,
      );
    });

    return exInfo.sort((a, b) => {
      if (a.orderNum > b.orderNum) return 1;
      return -1;
    });
  }

  public async Save(gameId: string, questionId: string, orderNum: number) {
    return await this.repo.save(GameQuizQuestionsInGameRepoEntity.Init(gameId, questionId, orderNum));
  }

  public async DeleteAll() {
    (await this.repo.delete({})).affected;
  }
}
