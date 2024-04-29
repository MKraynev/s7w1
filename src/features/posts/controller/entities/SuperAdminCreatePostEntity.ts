import { IsString, MaxLength, MinLength } from 'class-validator';

export class PostCreateEntity {
  @MaxLength(30)
  @MinLength(1)
  public title: string;

  @MaxLength(100)
  @MinLength(1)
  public shortDescription: string;

  @MaxLength(1000)
  @MinLength(1)
  public content: string;

  constructor(title: string, short: string, content: string) {
    this.title = title;
    this.shortDescription = short;
    this.content = content;
  }
}

export class PostWithExpectedBlogIdCreateEntity extends PostCreateEntity {
  @IsString()
  @MinLength(1)
  public blogId: string;
}
