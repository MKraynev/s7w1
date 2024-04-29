import { InputPaginator } from './QueryPaginatorInputEntity';

export class OutputPaginator {
  public pagesCount: number;
  public totalCount: number;
  public items: Array<any>;
  public page: number;
  public pageSize: number;

  constructor(
    totalCount: number,
    items: Array<any>,
    inputPaginator: InputPaginator,
  ) {
    this.pagesCount = Math.ceil(totalCount / inputPaginator.pageSize);

    this.page = Math.min(inputPaginator.pageNumber, this.pagesCount);

    this.pageSize = inputPaginator.pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}
