import { InjectRepository } from "@nestjs/typeorm";
import { QuizGameAnswerRepoEntity } from "./entities/GamesAnswersRepoEntity";
import { Repository } from "typeorm";

export class GameQuizAnswersRepoService {
  constructor(
    @InjectRepository(QuizGameAnswerRepoEntity)
    private repo: Repository<QuizGameAnswerRepoEntity>,
  ) {}

  public async GetUserAnswers(userId: string, gameId: string) {
    return await this.repo.find({ where: { gameId: +gameId, userId: +userId } });
  }

  public async Save(gameId: string, questionId: string, userId: string, answer: string) {
    return await this.repo.save(QuizGameAnswerRepoEntity.Init(gameId, questionId, userId, answer));
  }

  public async DeleteAll() {
    return (await this.repo.delete({})).affected;
  }
}
