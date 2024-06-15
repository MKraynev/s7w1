import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameComplexInfo } from "../entities/quiz.game.complex.info";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";
import { QuizGameInfo } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity";
import { QuizGamePlayerProgressEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGamePlayerProgressEntity";
import { UsersRepoService } from "../../../../../users/repo/UsersRepoService";
import { QuizGameQuestionsExtendedInfoEntity } from "../../repo/entities/QuizGameQuestionsExtendedInfoEntity";
import { QuizGamePlayerInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGamePlayerInfoEntity";
import { QuizGameQuestionInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameQuestionInfoEntity";
import { GamesRepoEntity } from "../../repo/entities/GamesRepoEntity";
import { QuizGameAnswerInfoEntity } from "../../controller/entities/QuizGameGetMyCurrent/QuizGameAnswerInfoEntity";

export class GameQuizGetByIdCommand {
  constructor(
    public gameId: string,
    public userId: string,
  ) {}
}
