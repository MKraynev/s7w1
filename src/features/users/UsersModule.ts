import { Module } from '@nestjs/common';
import { UsersController } from './controllers/UsersController';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersServiceRegistrationUseCase } from './service/use-cases/UsersServiceRegistrationUsecase';
import { UsersServiceConfirmRegistrationUseCase } from './service/use-cases/UsersServiceConfirmRegistrationUsecase';
import { UsersServiceLoginUseCase } from './service/use-cases/UsersServiceLoginUsecase';
import { UsersServiceResendingRegistrationUseCase } from './service/use-cases/UsersServiceResendingEmailRegistration';
import { UsersServiceGetMyDataUseCase } from './service/use-cases/UsersServiceGetMyData';
import { UsersServicePasswordRecoveryUseCase } from './service/use-cases/UsersServicePasswordRecovery';
import { UsersServiceNewPasswordUseCase } from './service/use-cases/UsersServiceNewPasswordUsecase';
import { UsersSerivceRefreshTokenUseCase } from './service/use-cases/UsersServiceRefreshTokenUsecase';
import { UsersServiceLogoutUseCase } from './service/use-cases/UsersServiceLogoutUsecase';
import { UsersRepoModule } from './repo/UsersRepoModule';
import { DeviceRepoModule } from '../devices/repo/DevicesRepoModule';
import { PassportModule } from '@nestjs/passport';
import { UsersAuthController } from './controllers/UsersAuthController';
import { JwtHandlerModule } from '../../jwt/JwtModule';
import { JwtStrategy } from '../../guards/common/StrategyJwt';
import { AdminStrategy } from '../../guards/admin/StrategyAdmin';
// import { EmailModule } from '../adapters/email/EmailModule';

export const UsersServiceUseCases = [
  UsersServiceRegistrationUseCase,
  UsersServiceConfirmRegistrationUseCase,
  UsersServiceLoginUseCase,
  UsersServiceResendingRegistrationUseCase,
  UsersServiceGetMyDataUseCase,
  UsersServicePasswordRecoveryUseCase,
  UsersServiceNewPasswordUseCase,
  UsersSerivceRefreshTokenUseCase,
  UsersServiceLogoutUseCase,
];

@Module({
  imports: [
    CqrsModule,
    UsersRepoModule,
    JwtHandlerModule,
    // EmailModule,
    DeviceRepoModule,
    PassportModule,
  ],
  controllers: [UsersController, UsersAuthController],
  providers: [...UsersServiceUseCases, AdminStrategy, JwtStrategy],
  exports: [...UsersServiceUseCases],
})
export class UsersModule {}
