import { IsJWT, MinLength } from "class-validator";

export class UsersControllerRegistrationConfirmEntity{
    @MinLength(10)
    @IsJWT()
    public code: string;
}