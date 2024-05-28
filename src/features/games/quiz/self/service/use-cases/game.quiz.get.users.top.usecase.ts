import { JwtServiceUserAccessTokenLoad } from "../../../../../../jwt/entities/JwtServiceAccessTokenLoad";

export class GameQuizGetUsersTopCommand {
  constructor(public userToken: JwtServiceUserAccessTokenLoad) {}
}
