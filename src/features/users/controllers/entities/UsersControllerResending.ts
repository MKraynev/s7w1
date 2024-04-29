import { IsEmail } from 'class-validator';

export class UsersControllerResending {
  @IsEmail()
  public email: string;
}
