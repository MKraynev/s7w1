import { IsEmail, MaxLength, MinLength } from "class-validator";

export class UserControllerRegistrationEntity {
    @MinLength(3)
    @MaxLength(10)
    public login: string;

    @IsEmail()
    public email: string;

    @MinLength(6)
    @MaxLength(20)
    public password: string;


    constructor(login: string, email: string, password: string) {
        this.login = login;
        this.email = email;
        this.password = password
    }
}