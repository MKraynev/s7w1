import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersRepoService } from '../../features/users/repo/UsersRepoService';
import { DeviceRepoService } from '../../features/devices/repo/DevicesRepoService';
import { BlogsRepoService } from '../../features/blogs/repo/blogs.repo.service';
import { PostsRepoService } from '../../features/posts/repo/PostsRepoService';
import { CommentsRepoService } from '../../features/comments/repo/CommentsRepoService';
import { LikeForPostRepoService } from '../../features/likes/postLikes/repo/LikesForPostRepoService';
import { LikeForCommentRepoService } from '../../features/likes/commentLikes/repo/LikesForCommentRepoService';
import { QuizQuestionRepoService } from '../../features/questions/repo/QuestionsRepoService';
import { GamesRepoService } from '../../features/games/repo/GamesRepoService';

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
