import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { UserControllerRegistrationEntity } from "./entities/UsersControllerRegistrationEntity";
import { CommandBus } from "@nestjs/cqrs";
import { Response } from "express";
import { UsersControllerRegistrationConfirmEntity } from "./entities/UsersControllerRegistrationConfirmEntity";
import { UserLoginEntity } from "./entities/UsersControllerLoginEntity";
import { UsersControllerResending } from "./entities/UsersControllerResending";
import { UserControllerPasswordRecoveryEntity } from "./entities/UsersControllerPasswordRecovertyEntity";
import { UserControllerNewPasswordEntity } from "./entities/UsersControllerNewPasswordEntity";
import { PasswordRecoveryStatus, UsersServicePasswordRecoveryCommand } from "../service/use-cases/UsersServicePasswordRecovery";
import { NewPasswordStatus, UsersServiceNewPasswordCommand } from "../service/use-cases/UsersServiceNewPasswordUsecase";
import { UserLoginDto, UserLoginStatus, UsersServiceLoginCommand } from "../service/use-cases/UsersServiceLoginUsecase";
import { RefreshTokenDto, RefreshTokenStatus, UsersSerivceRefreshTokenCommand } from "../service/use-cases/UsersServiceRefreshTokenUsecase";
import {
  ConfirmRegistrationUserStatus,
  UsersServiceConfirmRegistrationCommand,
} from "../service/use-cases/UsersServiceConfirmRegistrationUsecase";
import { RegistrationUserStatus, UsersServiceRegistrationCommand } from "../service/use-cases/UsersServiceRegistrationUsecase";
import {
  ResendingRegistrationStatus,
  UsersServiceResendingRegistrationCommand,
} from "../service/use-cases/UsersServiceResendingEmailRegistration";
import { LogoutStatus, UsersServiceLogoutCommand } from "../service/use-cases/UsersServiceLogoutUsecase";
import { UserPersonalInfo, UsersServiceGetMyDataCommand } from "../service/use-cases/UsersServiceGetMyData";
import { Throttle } from "@nestjs/throttler";
import { ValidateParameters } from "../../../pipes/ValidationPipe";
import { ReadRequestDevice } from "../../devices/decorators/RequestDeviceRead";
import { RequestDeviceEntity } from "../../devices/decorators/entity/RequestDeviceEntity";
import { ReadRefreshToken } from "../../../jwt/decorators/JwtRequestReadRefreshToken";
import { JwtServiceUserRefreshTokenLoad } from "../../../jwt/entities/JwtServiceRefreshTokenLoad";
import { JwtAuthGuard } from "../../../guards/common/JwtAuthGuard";
import { ReadAccessToken } from "../../../jwt/decorators/JwtRequestReadAccessToken";
import { JwtServiceUserAccessTokenLoad } from "../../../jwt/entities/JwtServiceAccessTokenLoad";

@Throttle({ default: { limit: 5, ttl: 10000 } })
@Controller("auth")
export class UsersAuthController {
  constructor(private commandBus: CommandBus) {}

  //post -> /hometask_14/api/auth/password-recovery
  @Post("password-recovery")
  @HttpCode(HttpStatus.NO_CONTENT)
  async PasswordRecovery(
    @Body(new ValidateParameters())
    recoveryDto: UserControllerPasswordRecoveryEntity,
  ) {
    let startRecoveryStatus = await this.commandBus.execute<UsersServicePasswordRecoveryCommand, PasswordRecoveryStatus>(
      new UsersServicePasswordRecoveryCommand(recoveryDto.email),
    );

    switch (startRecoveryStatus) {
      case PasswordRecoveryStatus.Succsess:
        return;

      default:
      case PasswordRecoveryStatus.EmailNotConfirmed:
      case PasswordRecoveryStatus.UserNotFound:
        return;
    }
  }

  //post -> /hometask_14/api/auth/new-password
  @Post("new-password")
  @HttpCode(HttpStatus.NO_CONTENT)
  async SaveNewUserPassword(@Body(new ValidateParameters()) newPassDto: UserControllerNewPasswordEntity) {
    let setNewPasswordStatus = await this.commandBus.execute<UsersServiceNewPasswordCommand, NewPasswordStatus>(
      new UsersServiceNewPasswordCommand(newPassDto.newPassword, newPassDto.recoveryCode),
    );

    switch (setNewPasswordStatus) {
      case NewPasswordStatus.Success:
        return;

      default:
      case NewPasswordStatus.UserNotFound:
      case NewPasswordStatus.NotRelevantCode:
      case NewPasswordStatus.SamePassword:
        throw new BadRequestException();
    }
  }

  //post -> /hometask_14/api/auth/login
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async Login(
    @Body(new ValidateParameters()) userDto: UserLoginEntity,
    @Res({ passthrough: true }) response: Response,
    @ReadRequestDevice() device: RequestDeviceEntity,
  ) {
    let login = await this.commandBus.execute<UsersServiceLoginCommand, UserLoginDto>(
      new UsersServiceLoginCommand(userDto.loginOrEmail, userDto.password, device),
    );

    switch (login.status) {
      case UserLoginStatus.Success:
        response.cookie("refreshToken", login.refreshToken, {
          httpOnly: true,
          secure: true,
        });
        response.status(200).send({ accessToken: login.accessToken });
        break;

      default:
      case UserLoginStatus.NotFound:
      case UserLoginStatus.WrongPassword:
        throw new UnauthorizedException();
        break;
    }
  }

  //post -> /hometask_14/api/auth/refresh-token
  @Post("refresh-token")
  public async RefreshToken(
    @ReadRequestDevice() device: RequestDeviceEntity,
    @ReadRefreshToken() token: JwtServiceUserRefreshTokenLoad,
    @Res({ passthrough: true }) response: Response,
  ) {
    let getRefreshTokens = await this.commandBus.execute<UsersSerivceRefreshTokenCommand, RefreshTokenDto>(
      new UsersSerivceRefreshTokenCommand(token, device),
    );

    switch (getRefreshTokens.status) {
      case RefreshTokenStatus.Success:
        response.cookie("refreshToken", getRefreshTokens.refreshToken, {
          httpOnly: true,
          secure: true,
        });
        response.status(200).send({ accessToken: getRefreshTokens.accessToken });
        break;

      default:
      case RefreshTokenStatus.TokenExpired:
      case RefreshTokenStatus.UserDeviceNotFound:
      case RefreshTokenStatus.UserNotFound:
      case RefreshTokenStatus.WrongDevice:
        throw new UnauthorizedException();
        break;
    }
  }

  //post -> /hometask_14/api/auth/registration-confirmation
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @Post("registration-confirmation")
  @HttpCode(HttpStatus.NO_CONTENT)
  async ConfrimEmail(
    @Body(new ValidateParameters())
    codeDto: UsersControllerRegistrationConfirmEntity,
    @ReadRequestDevice() device: RequestDeviceEntity,
  ) {
    let confirmEmailStatus = await this.commandBus.execute<UsersServiceConfirmRegistrationCommand, ConfirmRegistrationUserStatus>(
      new UsersServiceConfirmRegistrationCommand(codeDto.code),
    );

    switch (confirmEmailStatus) {
      case ConfirmRegistrationUserStatus.Success:
        return;
        break;

      default:
      case ConfirmRegistrationUserStatus.NotFound:
      case ConfirmRegistrationUserStatus.EmailAlreadyConfirmed:
        throw new BadRequestException({
          errorsMessages: [{ message: "Wrong code", field: "code" }],
        });
        break;
    }
  }

  //post -> /hometask_14/api/auth/registration
  @Post("registration")
  @HttpCode(HttpStatus.NO_CONTENT)
  async Registration(@Body(new ValidateParameters()) user: UserControllerRegistrationEntity) {
    let saveUserStatus = await this.commandBus.execute<UsersServiceRegistrationCommand, RegistrationUserStatus>(
      new UsersServiceRegistrationCommand(user),
    );

    switch (saveUserStatus) {
      case RegistrationUserStatus.Success:
        return;

      case RegistrationUserStatus.EmailAlreadyExist:
        throw new BadRequestException({
          errorsMessages: [{ message: "Email already exist", field: "email" }],
        });
        break;

      default:
      case RegistrationUserStatus.LoginAlreadyExist:
        throw new BadRequestException({
          errorsMessages: [{ message: "Login already exist", field: "login" }],
        });
        break;
    }
  }

  //post -> /hometask_14/api/auth/registration-email-resending
  @Post("registration-email-resending")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async ResendingEmail(@Body(new ValidateParameters()) userDto: UsersControllerResending) {
    let resendingStatus = await this.commandBus.execute<UsersServiceResendingRegistrationCommand, ResendingRegistrationStatus>(
      new UsersServiceResendingRegistrationCommand(userDto),
    );

    switch (resendingStatus) {
      case ResendingRegistrationStatus.Success:
        return;
        break;

      default:
      case ResendingRegistrationStatus.UserNotFound:
      case ResendingRegistrationStatus.EmailAlreadyConfirmed:
        throw new BadRequestException({
          errorsMessages: [{ message: "Wrong email", field: "email" }],
        });
        break;
    }
  }

  //post -> /hometask_14/api/auth/logout
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async Logout(@ReadRefreshToken() refreshToken: JwtServiceUserRefreshTokenLoad, @ReadRequestDevice() device: RequestDeviceEntity) {
    let logoutStatus = await this.commandBus.execute<UsersServiceLogoutCommand, LogoutStatus>(
      new UsersServiceLogoutCommand(device, refreshToken),
    );

    switch (logoutStatus) {
      case LogoutStatus.Success:
        return;
        break;

      default:
      case LogoutStatus.DeviceNotFound:
      case LogoutStatus.ExpiredToken:
      case LogoutStatus.WrongDevice:
        throw new UnauthorizedException();
        break;
    }
  }

  //get -> /hometask_14/api/auth/me
  @Get("me")
  @UseGuards(JwtAuthGuard)
  public async GetPersonalData(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {
    let foundUserData = await this.commandBus.execute<UsersServiceGetMyDataCommand, UserPersonalInfo>(
      new UsersServiceGetMyDataCommand(tokenLoad),
    );

    if (foundUserData) return foundUserData;

    throw new NotFoundException();
  }
}
