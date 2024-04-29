import { IsEmail } from "class-validator";

export class UserControllerPasswordRecoveryEntity {
    @IsEmail()
    public email: string
}