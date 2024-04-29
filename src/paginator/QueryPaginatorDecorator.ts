import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { InputPaginator } from './entities/QueryPaginatorInputEntity';

export const QueryPaginator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    let query = ctx.getArgs()[0].query;
    let inputPaginator = new InputPaginator(
      query.pageNumber,
      query.pageSize,
      query.sortDirection,
    );

    return inputPaginator;
  },
);
