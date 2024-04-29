import { IsUrl, MaxLength, MinLength } from 'class-validator';

export class BlogCreateEntity {
  @MinLength(3)
  @MaxLength(15)
  public name: string;

  @MaxLength(500)
  public description: string;

  @MaxLength(100)
  @IsUrl()
  public websiteUrl: string;

  constructor(name: string, desc: string, web: string) {
    this.name = name;
    this.description = desc;
    this.websiteUrl = web;
  }
}
