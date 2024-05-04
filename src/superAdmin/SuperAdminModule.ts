import { Module } from "@nestjs/common";
import { AdminTestingController } from "./controllers/SuperAdminTestingController";
import { SuperAdminBlogController } from "./controllers/SuperAdminBlogsController";
import { UsersRepoModule } from "../features/users/repo/UsersRepoModule";
import { DeviceRepoModule } from "../features/devices/repo/DevicesRepoModule";
import { PostsRepoModule } from "../features/posts/repo/PostsRepoModule";
import { CommentRepoModule } from "../features/comments/repo/CommentsRepoModule";
import { LikesForPostRepoModule } from "../features/likes/postLikes/repo/LikesForPostRepoModule";
import { LikesForCommentRepoModule } from "../features/likes/commentLikes/repo/LikesForCommentRepoModule";
import { QuizQuestRepoModule } from "../features/games/quiz/questions/repo/QuestionsRepoModule";
import { GameQuizRepoModule } from "../features/games/quiz/self/repo/GamesRepoModule";
import { BlogsRepoModule } from "../features/blogs/repo/blogs.repo.module";

const adaminControllers = [AdminTestingController, SuperAdminBlogController];
const adminImports = [
  UsersRepoModule,
  DeviceRepoModule,
  BlogsRepoModule,
  PostsRepoModule,
  CommentRepoModule,
  LikesForPostRepoModule,
  LikesForCommentRepoModule,
  QuizQuestRepoModule,
  GameQuizRepoModule,
];
@Module({
  imports: [...adminImports],
  controllers: [...adaminControllers],
})
export class SuperAdminModule {}
