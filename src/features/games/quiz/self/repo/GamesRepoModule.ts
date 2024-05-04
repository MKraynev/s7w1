import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GamesRepoEntity } from "./entities/GamesRepoEntity";
import { GamesRepoService } from "./GamesRepoService";

@Module({
  imports: [TypeOrmModule.forFeature([GamesRepoEntity])],
  providers: [GamesRepoService],
  exports: [GamesRepoService],
})
export class GameQuizRepoModule {}
