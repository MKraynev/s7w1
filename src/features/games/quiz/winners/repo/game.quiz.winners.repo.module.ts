import { Module } from "@nestjs/common";
import { GameQuizWinnerRepoEntity } from "./entity/game.quiz.winner.repo.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameQuizWinnersRepoService } from "./game.quiz.winners.repo.service";

@Module({
  imports: [TypeOrmModule.forFeature([GameQuizWinnerRepoEntity])],
  providers: [GameQuizWinnersRepoService],
  exports: [GameQuizWinnersRepoService],
})
export class GameQuizWinnersRepoModule {}
