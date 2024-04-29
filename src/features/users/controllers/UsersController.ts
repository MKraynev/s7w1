import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserControllerRegistrationEntity } from './entities/UsersControllerRegistrationEntity';
import { UsersRepoService } from '../repo/UsersRepoService';
import { UserRepoEntity } from '../repo/entities/UsersRepoEntity';
import { SuperAdminGuard } from '../../../guards/admin/GuardAdmin';
import { QueryPaginator } from '../../../paginator/QueryPaginatorDecorator';
import { InputPaginator } from '../../../paginator/entities/QueryPaginatorInputEntity';
import { OutputPaginator } from '../../../paginator/entities/QueryPaginatorUutputEntity';
import { ValidateParameters } from '../../../pipes/ValidationPipe';

@Controller('sa/users')
@UseGuards(SuperAdminGuard)
export class UsersController {
  constructor(private usersRepo: UsersRepoService) {}

  @Get()
  async GetUsers(
    @Query('searchLoginTerm') loginTerm: string | undefined,
    @Query('searchEmailTerm') emailTerm: string | undefined,
    @Query('sortBy') sortBy: keyof UserRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
  ) {
    if (!(loginTerm || emailTerm)) {
      loginTerm = '';
      emailTerm = '';
    }

    let { countAll, foundusers } =
      await this.usersRepo.ReadManyLikeByLoginByEmail(
        loginTerm,
        emailTerm,
        sortBy,
        sortDirecrion,
        paginator.skipElements,
        paginator.pageSize,
      );

    let users = foundusers.map((user) => user.Transform());

    let count = countAll;
    let pagedUsers = new OutputPaginator(count, users, paginator);

    return pagedUsers;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async SaveUser(
    @Body(new ValidateParameters()) user: UserControllerRegistrationEntity,
  ) {
    let dbUser = await this.usersRepo.Create(user, true);
    let transformedUser = dbUser.Transform();

    return transformedUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteUser(@Param('id') id: string) {
    let userId = +id;

    let deletedUser = userId && (await this.usersRepo.DeleteOne(userId));

    if (deletedUser) return;

    throw new NotFoundException();
  }
}
