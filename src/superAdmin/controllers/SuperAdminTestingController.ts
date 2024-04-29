import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { BlogsRepoService } from 'src/features/blogs/repo/blogs.repo.service';
import { CommentsRepoService } from 'src/features/comments/repo/CommentsRepoService';
import { DeviceRepoService } from 'src/features/devices/repo/DevicesRepoService';
import { GamesRepoService } from 'src/features/games/repo/GamesRepoService';
import { LikeForCommentRepoService } from 'src/features/likes/commentLikes/repo/LikesForCommentRepoService';
import { LikeForPostRepoService } from 'src/features/likes/postLikes/repo/LikesForPostRepoService';
import { PostsRepoService } from 'src/features/posts/repo/PostsRepoService';
import { QuizQuestionRepoService } from 'src/features/questions/repo/QuestionsRepoService';
import { UsersRepoService } from 'src/features/users/repo/UsersRepoService';

// @UseGuards(AdminGuard)
@Controller('testing/all-data')
export class AdminTestingController {
  constructor(
    private userRepo: UsersRepoService,
    private deviceRepo: DeviceRepoService,
    private blogRepo: BlogsRepoService,
    private postRepo: PostsRepoService,
    private commentRepo: CommentsRepoService,
    private likeForPost: LikeForPostRepoService,
    private likeForComments: LikeForCommentRepoService,
    private quizQuestionsRepo: QuizQuestionRepoService,
    private quizGameRepo: GamesRepoService,
  ) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteAll() {
    await this.quizGameRepo.DeleteAll();
    await this.blogRepo.DeleteAll();
    await this.userRepo.DeleteAll();
    await this.postRepo.DeleteAll();
    await this.commentRepo.DeleteAll();
    await this.likeForPost.DeleteAll();
    await this.likeForComments.DeleteAll();
    await this.deviceRepo.DeleteAll();
    await this.quizQuestionsRepo.DeleteAll();

    return;
  }
}
