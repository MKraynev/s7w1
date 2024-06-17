import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GamesRepoEntity } from "./entities/GamesRepoEntity";
import { GamesRepoService } from "./GamesRepoService";
import { GameQuizClosingGameEntity } from "./entities/game.quiz.closing.game.entity";

@Module({
  imports: [TypeOrmModule.forFeature([GamesRepoEntity]), TypeOrmModule.forFeature([GameQuizClosingGameEntity])],
  providers: [GamesRepoService],
  exports: [GamesRepoService],
})
export class GameQuizRepoModule {}
