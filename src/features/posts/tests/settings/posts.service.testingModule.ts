import { Test } from '@nestjs/testing';

import { PostUseCases } from '../../PostModule';
import { PostsRepoModule } from '../../repo/PostsRepoModule';
import { testDbConfiguration } from '../../../devices/repo/tests/settings/devices.repo.testingModule';
import { CommentRepoModule } from '../../../comments/repo/CommentsRepoModule';
import { LikesForPostRepoModule } from '../../../likes/postLikes/repo/LikesForPostRepoModule';
import { UsersRepoModule } from '../../../users/repo/UsersRepoModule';

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
