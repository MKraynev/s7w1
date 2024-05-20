import { CqrsModule } from "@nestjs/cqrs";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_URL, POSTGRES_USERNAME } from "../../../../../../../settings";
import { UserRepoEntity } from "../../../../../../users/repo/entities/UsersRepoEntity";
import { GamesRepoEntity } from "../../entities/GamesRepoEntity";
import { UsersRepoModule } from "../../../../../../users/repo/UsersRepoModule";
import { GameQuizRepoModule } from "../../GamesRepoModule";
import { UsersRepoService } from "../../../../../../users/repo/UsersRepoService";
import { GamesRepoService } from "../../GamesRepoService";
import { DeviceRepoModule } from "../../../../../../devices/repo/DevicesRepoModule";
import { DeviceRepoEntity } from "../../../../../../devices/repo/entities/DevicesRepoEntity";
import { LikeForPostRepoEntity } from "../../../../../../likes/postLikes/repo/entity/LikeForPostsRepoEntity";
import { LikeForCommentRepoEntity } from "../../../../../../likes/commentLikes/repo/entity/LikeForCommentsRepoEntity";
import { CommentRepoEntity } from "../../../../../../comments/repo/entities/CommentsRepoEntity";
import { PostRepoEntity } from "../../../../../../posts/repo/entity/PostsRepoEntity";
import { BlogRepoEntity } from "../../../../../../blogs/repo/entities/blogs.repo.entity";
import { QuizGameAnswerRepoEntity } from "../../../../answers/repo/entities/GamesAnswersRepoEntity";
import { QuizQuestionEntity } from "../../../../questions/repo/entity/QuestionsRepoEntity";

export const testDbConfiguration = TypeOrmModule.forRoot({
  type: "postgres",
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: "Test",
  autoLoadEntities: true,
  synchronize: true,
});

export const TestGameQuizRepoTestingModule = Test.createTestingModule({
  imports: [
    testDbConfiguration,
    TypeOrmModule.forFeature([
      UserRepoEntity,
      DeviceRepoEntity,
      GamesRepoEntity,
      LikeForPostRepoEntity,
      LikeForCommentRepoEntity,
      CommentRepoEntity,
      PostRepoEntity,
      BlogRepoEntity,
      QuizGameAnswerRepoEntity,
      QuizQuestionEntity,
    ]),
  ],
  providers: [UsersRepoService, GamesRepoService],
});
