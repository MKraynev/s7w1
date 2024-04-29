import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepoEntity } from '../entities/UsersRepoEntity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class UsersRepoReadOneByPropertyValueCommand {
  constructor(
    public message: { propertyName: keyof UserRepoEntity; propertyValue: any },
  ) {}
}

@Injectable()
@CommandHandler(UsersRepoReadOneByPropertyValueCommand)
export class UsersRepoReadOneByPropertyValueUseCase
  implements
    ICommandHandler<UsersRepoReadOneByPropertyValueCommand, UserRepoEntity>
{
  constructor(
    @InjectRepository(UserRepoEntity)
    private userRepo: Repository<UserRepoEntity>,
  ) {}

  async execute(
    command: UsersRepoReadOneByPropertyValueCommand,
  ): Promise<UserRepoEntity | null> {
    // let findObj: FindOptionsWhere<UserRepoEntity> = {};
    let findObj: any = {};
    findObj[command.message.propertyName] = command.message.propertyValue;

    return await this.userRepo.findOne({ where: findObj });
  }
}
