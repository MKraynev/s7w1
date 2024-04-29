import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepoEntity } from '../entities/UsersRepoEntity';
import { Repository } from 'typeorm';

export class UsersRepoClearCommand {}

@Injectable()
@CommandHandler(UsersRepoClearCommand)
export class UsersRepoClearUseCase
  implements ICommandHandler<UsersRepoClearCommand, number>
{
  constructor(
    @InjectRepository(UserRepoEntity)
    private userRepo: Repository<UserRepoEntity>,
  ) {}

  async execute(command: UsersRepoClearCommand): Promise<number> {
    let deleteAll = await this.userRepo.delete({});

    return deleteAll.affected;
  }
}
