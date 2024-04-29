import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
// import { EmailService } from 'src/adapters/email/EmailService';
import { UsersRepoService } from '../../repo/UsersRepoService';
import { JwtHandlerService } from 'src/jwt/JwtService';
import { UserControllerRegistrationEntity } from '../../controllers/entities/UsersControllerRegistrationEntity';

export class UsersServiceRegistrationCommand {
  constructor(public command: UserControllerRegistrationEntity) {}
}

export enum RegistrationUserStatus {
  Success,
  EmailAlreadyExist,
  LoginAlreadyExist,
  ErrorEmailSending,
}

@Injectable()
@CommandHandler(UsersServiceRegistrationCommand)
export class UsersServiceRegistrationUseCase
  implements
    ICommandHandler<UsersServiceRegistrationCommand, RegistrationUserStatus>
{
  constructor(
    private usersRepo: UsersRepoService,
    // private emailService: EmailService,
    private jwtHandler: JwtHandlerService,
  ) {}

  async execute(
    command: UsersServiceRegistrationCommand,
  ): Promise<RegistrationUserStatus> {
    let userInputData = command.command;

    let foundusers = await this.usersRepo.ReadManyCertainByLoginByEmail(
      userInputData.login,
      userInputData.email,
    );

    if (foundusers.length) {
      let status =
        foundusers[0].login === userInputData.login
          ? RegistrationUserStatus.LoginAlreadyExist
          : RegistrationUserStatus.EmailAlreadyExist;

      return status;
    }

    let savedUser = await this.usersRepo.Create(userInputData);

    let registrationCode = await this.jwtHandler.GenerateUserRegistrationCode({
      id: savedUser.id.toString(),
    });

    // await this.emailService.SendRegistrationMail(
    //   userInputData.email,
    //   registrationCode,
    //   '/auth/registration-confirmation',
    // );

    return RegistrationUserStatus.Success;
  }
}
