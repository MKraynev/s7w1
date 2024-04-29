export class InputPaginator{
    public pageNumber: number;
    public pageSize: number;
    public skipElements: number;

    constructor(
        pageNumber_str: string | undefined,
        pageSize_str: string | undefined,
        public sortDirection: "asc" | "desc" = "desc"
    ) {
        this.pageNumber = parseInt(pageNumber_str) || 1;
        this.pageSize = parseInt(pageSize_str) || 10;
        this.skipElements = (this.pageNumber - 1) * this.pageSize;
    }
}