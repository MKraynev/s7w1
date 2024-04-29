import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForPostRepoEntity } from '../../entity/LikeForPostsRepoEntity';
import { LikeForPostRepoService } from '../../LikesForPostRepoService';

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
