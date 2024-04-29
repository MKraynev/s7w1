import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForPostRepoEntity } from 'src/features/likes/postLikes/repo/entity/LikeForPostsRepoEntity';
import { LikeForPostRepoService } from 'src/features/likes/postLikes/repo/LikesForPostRepoService';

// export const TestLikesForPostsRepoTestingModule = Test.createTestingModule({
//   imports: [
//     testDbConfiguration,

//     TypeOrmModule.forFeature([
//       LikeForPostRepoEntity,
//       UserRepoEntity,
//       BlogRepoEntity,
//       PostRepoEntity,
//     ]),
//     UsersRepoModule,
//     BlogsRepoModule,
//     PostsRepoModule,
//   ],
//   providers: [
//     BlogsRepoService,
//     PostsRepoService,
//     UsersRepoService,
//     LikeForPostRepoService,
//   ],
// });
