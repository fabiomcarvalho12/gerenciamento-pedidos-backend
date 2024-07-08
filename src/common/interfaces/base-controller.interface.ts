import { BaseQuerystringDto } from '../bases/base-query-string.dto';

export interface IBaseController<
  T,
  createDTO,
  updateDTO,
  queryStringDTO extends BaseQuerystringDto,
> {
  create(data: createDTO, uuid?: string);

  findAll(queryString: queryStringDTO);

  findById(uuid: string);

  update(data: updateDTO, uuid: string, uuidSon?: string);

  remove(uuid: string, uuidSon?: string);

  getFilters(queryString: queryStringDTO);
}
