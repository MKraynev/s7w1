import { MaxLength, MinLength } from "class-validator";

export class UserControllerNewPasswordEntity {
    @MinLength(6)
    @MaxLength(20)
    public newPassword: string

    @MinLength(10)
    public recoveryCode: string
}