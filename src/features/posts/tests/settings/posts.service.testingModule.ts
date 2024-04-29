import { Test } from '@nestjs/testing';

import { PostUseCases } from '../../PostModule';
import { testDbConfiguration } from 'src/features/users/repo/tests/settings/users.repo.testingModule';
import { PostsRepoModule } from '../../repo/PostsRepoModule';
import { CommentRepoModule } from 'src/features/comments/repo/CommentsRepoModule';
import { LikesForPostRepoModule } from 'src/features/likes/postLikes/repo/LikesForPostRepoModule';
import { UsersRepoModule } from 'src/features/users/repo/UsersRepoModule';

export const TestUsersServiceTestingModule = Test.createTestingModule({
  imports: [
    testDbConfiguration,
    PostsRepoModule,
    CommentRepoModule,
    LikesForPostRepoModule,
    UsersRepoModule,
  ],
  providers: [...PostUseCases],
});
