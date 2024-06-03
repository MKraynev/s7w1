import { ForbiddenException, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameInfo } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { QuizQuestionRepoService } from "../../../questions/repo/QuestionsRepoService";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";
import { QuizGameQuestionInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameQuestionInfoEntity";
import { GamesRepoEntity } from "../../repo/entities/GamesRepoEntity";

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
    let userCurrentGame = await this.gameRepo.GetUserCurrentGame(command.userId);

    if (userCurrentGame) {
      console.log("throw 403, userCurrentGame:", userCurrentGame);
      throw new ForbiddenException("Player already got active game");
    }

    let activeSearchingGame = await this.gameRepo.GetSearchingGame(command.userId);

    if (activeSearchingGame) {
      let questionsForNewGame = await this.questionRepo.GetRandomQuesitons(GameQuizRules.GetGameQuestionCount());

      questionsForNewGame.forEach(
        async (gameQuestion, order) =>
          await this.questionsInGameRepo.Save(activeSearchingGame.id.toString(), gameQuestion.id.toString(), order),
      );

      activeSearchingGame = this.AssemblyGame(activeSearchingGame, command.userId);

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

  private AssemblyGame(game: GamesRepoEntity, newUserId: string) {
    game.player_2_id = +newUserId;
    game.status = "Active";
    game.startedAt = new Date();
    game.player_1_score = 0;
    game.player_2_score = 0;

    return game;
  }
}
