import { Controller, Delete, HttpCode, HttpStatus } from "@nestjs/common";
import { UsersRepoService } from "../../features/users/repo/UsersRepoService";
import { DeviceRepoService } from "../../features/devices/repo/DevicesRepoService";
import { BlogsRepoService } from "../../features/blogs/repo/blogs.repo.service";
import { PostsRepoService } from "../../features/posts/repo/PostsRepoService";
import { CommentsRepoService } from "../../features/comments/repo/CommentsRepoService";
import { LikeForPostRepoService } from "../../features/likes/postLikes/repo/LikesForPostRepoService";
import { LikeForCommentRepoService } from "../../features/likes/commentLikes/repo/LikesForCommentRepoService";
import { QuizQuestionRepoService } from "../../features/games/quiz/questions/repo/QuestionsRepoService";
import { GamesRepoService } from "../../features/games/quiz/self/repo/GamesRepoService";
import { GameQuizAnswersRepoService } from "../../features/games/quiz/answers/repo/game.quiz.answers.repo.service";
import { GameQuizQuestionsInGameService } from "../../features/games/quiz/questions.in.game/repo/game.quiz.questions.in.game.repo.service";
import { GameQuizWinnersRepoService } from "../../features/games/quiz/winners/repo/game.quiz.winners.repo.service";

@Controller("testing/all-data")
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
    private quizQuestionsInGameRepo: GameQuizQuestionsInGameService,
    private quizGameRepo: GamesRepoService,
    private answersRepo: GameQuizAnswersRepoService,
    private winnerRepo: GameQuizWinnersRepoService,
  ) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteAll() {
    await Promise.all([
      this.blogRepo.DeleteAll(),
      this.quizGameRepo.DeleteAll(),
      this.userRepo.DeleteAll(),
      this.postRepo.DeleteAll(),
      this.commentRepo.DeleteAll(),
      this.likeForPost.DeleteAll(),
      this.likeForComments.DeleteAll(),
      this.deviceRepo.DeleteAll(),
      this.quizQuestionsRepo.DeleteAll(),
      this.answersRepo.DeleteAll(),
      this.quizQuestionsInGameRepo.DeleteAll(),
      this.winnerRepo.DeleteAll(),
    ]);

    return;
  }
}
