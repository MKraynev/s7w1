import { Injectable } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";

@Injectable()
export class AppService {
  constructor() {}
  getHello(): string {
    return "Hello World!";
  }
}
