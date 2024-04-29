import { IsString, MaxLength, MinLength } from "class-validator";

export class UserLoginEntity {
    @MinLength(3)
    @MaxLength(50)
    public loginOrEmail: string;

    @MinLength(6)
    @MaxLength(20)
    public password: string;
}