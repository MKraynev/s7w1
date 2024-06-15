import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandBus, ICommandHandler } from "@nestjs/cqrs";
import { QuizGameAnswerResult } from "../entities/quiz.game.answer.result";
import { GamesRepoService } from "../../repo/GamesRepoService";
import { GameQuizQuestionsInGameService } from "../../../questions.in.game/repo/game.quiz.questions.in.game.repo.service";
import { QuizGameQuestionsExtendedInfoEntity } from "../../repo/entities/QuizGameQuestionsExtendedInfoEntity";
import { GameQuizRules } from "../../../rules/game.quiz.rules";
import { GameQuizAnswersRepoService } from "../../../answers/repo/game.quiz.answers.repo.service";
import { QuizGameAnswerRepoEntity } from "../../../answers/repo/entities/GamesAnswersRepoEntity";
import { GameQuizWinnersRepoService } from "../../../winners/repo/game.quiz.winners.repo.service";
import { QuizGameStatus } from "../../../winners/repo/entity/game.quiz.winner.repo.entity";

export class GameQuizAnswerTheQuestionCommand {
  constructor(
    public userId: string,
    public userLogin: string,
    public answer: string,
  ) {}
}
