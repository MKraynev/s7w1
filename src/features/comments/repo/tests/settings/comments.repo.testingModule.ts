import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepoEntity } from '../../entities/CommentsRepoEntity';
import { CommentsRepoService } from '../../CommentsRepoService';

// export const TestCommentsRepoTestingModule = Test.createTestingModule({
//   imports: [
//     testDbConfiguration,
//     TypeOrmModule.forFeature([
//       LikeForPostRepoEntity,
//       UserRepoEntity,
//       BlogRepoEntity,
//       PostRepoEntity,
//       CommentRepoEntity,
//     ]),
//     UsersRepoModule,
//     BlogsRepoModule,
//     PostsRepoModule,
//     LikesForPostRepoModule,
//   ],
//   providers: [
//     BlogsRepoService,
//     PostsRepoService,
//     UsersRepoService,
//     LikeForPostRepoService,
//     CommentsRepoService,
//   ],
// });
