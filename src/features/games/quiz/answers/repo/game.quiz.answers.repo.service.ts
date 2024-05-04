import { InjectRepository } from "@nestjs/typeorm";
import { QuizGameAnswerRepoEntity } from "./entities/GamesAnswersRepoEntity";
import { Repository } from "typeorm";

export class GameQuizAnswersRepoService {
  constructor(
    @InjectRepository(QuizGameAnswerRepoEntity)
    private repo: Repository<QuizGameAnswerRepoEntity>,
  ) {}

  public async GetUserAnswers(userId: string, gameId: string) {}
}
