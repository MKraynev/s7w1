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
