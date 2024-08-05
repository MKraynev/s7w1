import { IsNotEmpty, MaxLength, MinLength, NotEquals, notEquals } from "class-validator";

export class BloggerControllerPostBlogsPostByBlogIdEntity {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  public title: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  public shortDescription: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  public content: string;
}
