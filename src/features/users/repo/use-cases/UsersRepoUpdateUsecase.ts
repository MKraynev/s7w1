import { Injectable } from '@nestjs/common';
import { UserRepoEntity } from '../entities/UsersRepoEntity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class UsersRepoUpdateOneCommand {
  constructor(public user: UserRepoEntity) {}
}

@Injectable()
@CommandHandler(UsersRepoUpdateOneCommand)
export class UsersRepoUpdateOneUseCase
  implements ICommandHandler<UsersRepoUpdateOneCommand, UserRepoEntity>
{
  constructor(
    @InjectRepository(UserRepoEntity)
    private userRepo: Repository<UserRepoEntity>,
  ) {}
  async execute(command: UsersRepoUpdateOneCommand): Promise<UserRepoEntity> {
    let updatedUser = await this.userRepo.save(command.user);

    return updatedUser;
  }
}
