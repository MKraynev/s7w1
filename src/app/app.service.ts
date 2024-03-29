import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(@InjectDataSource() public dataSource: DataSource) {}
  async getHello(): Promise<string> {
    return 'hello world';
  }
}
