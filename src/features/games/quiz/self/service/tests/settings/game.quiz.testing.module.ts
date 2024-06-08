import { TypeOrmModule } from "@nestjs/typeorm";
import { POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_URL, POSTGRES_USERNAME } from "../../../../../../../settings";
import { Test } from "@nestjs/testing";
import { GamesModule } from "../../../GamesModule";
import { DevicesModule } from "../../../../../../devices/DevicesModule";
import { LikesForPostRepoModule } from "../../../../../../likes/postLikes/repo/LikesForPostRepoModule";
import { CommentsModule } from "../../../../../../comments/CommentsModule";

export const testDbConfiguration = TypeOrmModule.forRoot({
  type: "postgres",
  url: POSTGRES_URL,
  port: POSTGRES_PORT,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: "Test",
  autoLoadEntities: true,
  synchronize: true,
});

export const TestGameQuizModule = Test.createTestingModule({
  imports: [testDbConfiguration, GamesModule, DevicesModule, LikesForPostRepoModule, LikesForPostRepoModule, CommentsModule],
});
