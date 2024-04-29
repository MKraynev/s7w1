import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepoService } from '../../repo/UsersRepoService';
import { JwtHandlerService } from '../../../../jwt/JwtService';

export enum NewPasswordStatus {
  Success,
  UserNotFound,
  NotRelevantCode,
  SamePassword,
}

export class UsersServiceNewPasswordCommand {
  constructor(
    public password: string,
    public recoveryCode: string,
  ) {}
}

@Injectable()
@CommandHandler(UsersServiceNewPasswordCommand)
export class UsersServiceNewPasswordUseCase
  implements ICommandHandler<UsersServiceNewPasswordCommand, NewPasswordStatus>
{
  constructor(
    private userRepo: UsersRepoService,
    private jwtService: JwtHandlerService,
  ) {}

  async execute(
    command: UsersServiceNewPasswordCommand,
  ): Promise<NewPasswordStatus> {
    let tokenData = await this.jwtService.ReadPasswordRecoveryToken(
      command.recoveryCode,
    );

    let foundUser = await this.userRepo.ReadOneById(tokenData.id);
    if (!foundUser) return NewPasswordStatus.UserNotFound;

    if (foundUser.refreshPasswordTime !== tokenData.recoveryTime)
      return NewPasswordStatus.NotRelevantCode;

    let newCodeIsSame = await foundUser.PasswordIsValid(command.password);
    if (newCodeIsSame) return NewPasswordStatus.SamePassword;

    await foundUser.UpdatePassword(command.password);

    this.userRepo.UpdateOne(foundUser);

    return NewPasswordStatus.Success;
  }
}
