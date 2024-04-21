import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsRepoService } from './blogs.repo.service';
import { BlogRepoEntity } from './entities/blogs.repo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogRepoEntity])],
  providers: [BlogsRepoService],
  exports: [BlogsRepoService],
})
export class BlogsRepoModule {}
