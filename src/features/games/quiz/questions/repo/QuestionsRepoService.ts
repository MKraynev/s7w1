import { InjectRepository } from "@nestjs/typeorm";
import { QuizQuestionEntity } from "./entity/QuestionsRepoEntity";
import { FindOptionsWhere, Raw, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { QuizQuestionPostEntity } from "../controllers/entities/QuestionsControllerPostEntity";

@Injectable()
export class QuizQuestionRepoService {
  constructor(
    @InjectRepository(QuizQuestionEntity)
    private repo: Repository<QuizQuestionEntity>,
  ) {}

  public async Create(inputData: QuizQuestionPostEntity, published: boolean = false) {
    let quizQuestDto = QuizQuestionEntity.Init(inputData.body, inputData.correctAnswers, published);

    let saveRes = await this.repo.save(quizQuestDto);

    return saveRes;
  }

  public async UpdatePublishStatus(id: string, status: boolean) {
    let id_num = +id;

    if (Number.isNaN(id_num)) return 0;

    let question = await this.repo.findOneBy({ id: id_num });

    if (!question) return 0;

    question.published = status;

    await this.repo.save(question);

    return 1;
  }

  public async UpdateOne(id: string, inputData: QuizQuestionPostEntity) {
    let id_num = +id;

    if (Number.isNaN(id_num)) return 0;
    let question = await this.repo.findOneBy({ id: id_num });

    if (!question) return 0;

    question.body = inputData.body;
    question.correctAnswers = inputData.correctAnswers;

    await this.repo.save(question);

    return 1;
  }

  public async DeleteAll() {
    await this.repo.delete({});
  }

  public async DeleteById(id: string) {
    let id_num = +id;

    if (Number.isNaN(id_num)) return 0;

    let delRes = await this.repo.delete({ id: id_num });

    return delRes.affected;
  }

  public async CountAndReadManyByName(
    bodyPattern: string,
    sortBy: keyof QuizQuestionEntity = "createdAt",
    sortDirection: "asc" | "desc" = "desc",
    skip: number = 0,
    limit: number = 10,
    format: boolean = false,
  ): Promise<{
    count: number;
    questions: QuizQuestionEntity[];
  }> {
    let BodySearchPattern: FindOptionsWhere<QuizQuestionEntity> = {};

    let caseInsensitiveSearchPattern = (column: string, inputValue: string) =>
      `LOWER(${column}) Like '%${inputValue.toLowerCase()}%'`;

    if (bodyPattern)
      BodySearchPattern["body"] = Raw((alias) => caseInsensitiveSearchPattern(alias, bodyPattern));

    let orderObj: any = {};
    orderObj[sortBy] = sortDirection;

    let count = await this.repo.count({ where: BodySearchPattern });
    let questions = await this.repo.find({
      where: BodySearchPattern,
      order: orderObj,
      skip: skip,
      take: limit,
    });

    return { count, questions: questions };
  }
}
