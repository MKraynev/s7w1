import { Injectable } from '@nestjs/common';
import { UsersControllerResending } from '../../controllers/entities/UsersControllerResending';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepoService } from '../../repo/UsersRepoService';
// import { EmailService } from 'src/adapters/email/EmailService';
import { JwtHandlerService } from 'src/jwt/JwtService';

export class UsersServiceResendingRegistrationCommand {
  constructor(public command: UsersControllerResending) {}
}

export enum ResendingRegistrationStatus {
  Success,
  UserNotFound,
  EmailAlreadyConfirmed,
}

@Injectable()
@CommandHandler(UsersServiceResendingRegistrationCommand)
export class UsersServiceResendingRegistrationUseCase
  implements
    ICommandHandler<
      UsersServiceResendingRegistrationCommand,
      ResendingRegistrationStatus
    >
{
  constructor(
    private usersRepo: UsersRepoService,
    // private emailService: EmailService,
    private jwtHandler: JwtHandlerService,
  ) {}

  async execute(
    command: UsersServiceResendingRegistrationCommand,
  ): Promise<ResendingRegistrationStatus> {
    let founduser = await this.usersRepo.ReadOneFullyByLoginOrEmail(
      command.command.email,
    );

    if (!founduser) return ResendingRegistrationStatus.UserNotFound;

    if (founduser.emailConfirmed)
      return ResendingRegistrationStatus.EmailAlreadyConfirmed;

    let registrationCode = await this.jwtHandler.GenerateUserRegistrationCode({
      id: founduser.id.toString(),
    });
    //_MAIN_.ADDRES +
    // this.emailService.SendRegistrationMail(
    //   founduser.email,
    //   registrationCode,
    //   '/auth/registration-confirmation',
    // );

    return ResendingRegistrationStatus.Success;
  }
}
