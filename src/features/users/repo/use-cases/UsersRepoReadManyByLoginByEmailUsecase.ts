import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepoEntity as UserRepoEntity } from '../entities/UsersRepoEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UsersRepoReadManyByLoginByEmailCommand {
  constructor(
    public login: string,
    public email: string,
  ) {}
}

@Injectable()
@CommandHandler(UsersRepoReadManyByLoginByEmailCommand)
export class UsersRepoReadManyByLoginByEmailUseCase
  implements
    ICommandHandler<UsersRepoReadManyByLoginByEmailCommand, UserRepoEntity[]>
{
  constructor(
    @InjectRepository(UserRepoEntity)
    private userRepo: Repository<UserRepoEntity>,
  ) {}

  async execute(
    command: UsersRepoReadManyByLoginByEmailCommand,
  ): Promise<UserRepoEntity[]> {
    let foundusers = await this.userRepo.find({
      where: [{ login: command.login }, { email: command.email }],
    });

    return foundusers;
  }
}
