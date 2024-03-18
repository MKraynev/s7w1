import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(@InjectDataSource() public dataSource: DataSource) {}
  async getHello(): Promise<string> {
    let dbData = await this.dataSource.query(`
  SELECT id, val
	FROM public.demo
  `);
    return dbData[0].val;
  }
}
