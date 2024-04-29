import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { EmailService } from '../adapters/email/EmailService';
import { UsersRepoService } from '../../repo/UsersRepoService';
import { JwtHandlerService } from '../../../../jwt/JwtService';

export enum PasswordRecoveryStatus {
  Succsess,
  UserNotFound,
  EmailNotConfirmed,
}

export class UsersServicePasswordRecoveryCommand {
  constructor(public email: string) {}
}

@Injectable()
@CommandHandler(UsersServicePasswordRecoveryCommand)
export class UsersServicePasswordRecoveryUseCase
  implements
    ICommandHandler<
      UsersServicePasswordRecoveryCommand,
      PasswordRecoveryStatus
    >
{
  constructor(
    private userRepo: UsersRepoService,
    // private emailService: EmailService,
    private jwtService: JwtHandlerService,
  ) {}
  async execute(
    command: UsersServicePasswordRecoveryCommand,
  ): Promise<PasswordRecoveryStatus> {
    let foundUser = await this.userRepo.ReadOneByPropertyValue(
      'email',
      command.email,
    );

    if (!foundUser) return PasswordRecoveryStatus.UserNotFound;

    if (!foundUser.emailConfirmed)
      return PasswordRecoveryStatus.EmailNotConfirmed;

    let recoveryTime = new Date();
    foundUser.refreshPasswordTime = recoveryTime;

    this.userRepo.UpdateOne(foundUser);
    let recoveryToken = await this.jwtService.GeneratePasswordRecoveryToken(
      foundUser.id,
      foundUser.refreshPasswordTime,
    );
    //_MAIN_.ADDRES +
    // this.emailService.SendPasswordRecoveryMail(
    //   foundUser.email,
    //   recoveryToken,
    //   '/auth/new-password',
    // );

    return PasswordRecoveryStatus.Succsess;
  }
}
