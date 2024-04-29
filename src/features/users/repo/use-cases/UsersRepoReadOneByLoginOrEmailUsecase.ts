import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepoEntity } from '../entities/UsersRepoEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UsersRepoReadOneByLoginOrEmailCommand {
  constructor(public message: string) {}
}

@Injectable()
@CommandHandler(UsersRepoReadOneByLoginOrEmailCommand)
export class UsersRepoReadOneByLoginOrEmailUseCase
  implements
    ICommandHandler<UsersRepoReadOneByLoginOrEmailCommand, UserRepoEntity>
{
  constructor(
    @InjectRepository(UserRepoEntity)
    private userRepo: Repository<UserRepoEntity>,
  ) {}

  async execute(
    command: UsersRepoReadOneByLoginOrEmailCommand,
  ): Promise<UserRepoEntity> {
    let founduser = await this.userRepo.findOne({
      where: [{ login: command.message }, { email: command.message }],
    });

    return founduser;
  }
}
