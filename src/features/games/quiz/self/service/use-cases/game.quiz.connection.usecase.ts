import { ForbiddenException, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameInfo } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { QuizQuestionRepoService } from "../../../questions/repo/QuestionsRepoService";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";
import { QuizGameQuestionInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameQuestionInfoEntity";

export class QuizGameConnectToGameCommand {
  constructor(
    public userId: string,
    public userLogin: string,
  ) {}
}

@CommandHandler(QuizGameConnectToGameCommand)
@Injectable()
export class QuizGameConnectToGameUseCase implements ICommandHandler<QuizGameConnectToGameCommand, QuizGameInfo> {
  constructor(
    private gameRepo: GamesRepoService,
    private questionRepo: QuizQuestionRepoService,
    private questionsInGameRepo: GameQuizQuestionsInGameService,
  ) {}

  async execute(command: QuizGameConnectToGameCommand): Promise<QuizGameInfo> {
    console.log("User ->", command.userId, command.userLogin);

    let userCurrentGame = await this.gameRepo.GetUserCurrentGame(command.userId);

    console.log("current user game ->", userCurrentGame);

    if (userCurrentGame) throw new ForbiddenException("Player already got active game");

    let activeSearchingGame = await this.gameRepo.GetSearchingGame(command.userId);

    if (activeSearchingGame) {
      let questionsForNewGame = await this.questionRepo.GetRandomQuesitons(GameQuizRules.GetGameQuestionCount());

      //DEBUG
      console.log("active game ->", activeSearchingGame);
      console.log("random questions ->", questionsForNewGame);

      await Promise.all(
        questionsForNewGame.map(
          async (gameQuestion, order) =>
            await this.questionsInGameRepo.Save(activeSearchingGame.id.toString(), gameQuestion.id.toString(), order),
        ),
      );

      activeSearchingGame.TakeSecondPlayer(+command.userId); //changed to active game

      await this.gameRepo.Save(activeSearchingGame);
      let savedGame = await this.gameRepo.FindOneById(activeSearchingGame.id.toString(), true);
      return QuizGameInfo.InitGame(
        savedGame,
        questionsForNewGame.map((question) => new QuizGameQuestionInfoEntity(question.id.toString(), question.body)),
      );
    }

    let newGame = await this.gameRepo.CreateGame(+command.userId);
    let newQuizGame = QuizGameInfo.InitNewGame(newGame.id.toString(), command.userId, command.userLogin, newGame.createdAt);

    return newQuizGame;
  }
}
