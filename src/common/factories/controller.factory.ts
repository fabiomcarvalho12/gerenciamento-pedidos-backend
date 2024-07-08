import { DeepPartial } from 'typeorm';
import { BaseQuerystringDto } from '../bases/base-query-string.dto';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Type,
  UsePipes,
} from '@nestjs/common';
import { AbstractValidationPipe } from '../pipes/abstract-validation.pipe';
import { BaseService } from '../bases/base.service';
import { IBaseController } from '../interfaces/base-controller.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export function ControllerFactory<
  T,
  createDTO extends DeepPartial<T>,
  updateDTO extends DeepPartial<T>,
  queryStringDTO extends BaseQuerystringDto,
>(
  createDTO: Type<createDTO>,
  updateDTO: Type<updateDTO>,
  queryStringDTO: Type<queryStringDTO>,
): Type<IBaseController<T, createDTO, updateDTO, queryStringDTO>> {
  const createPipe = new AbstractValidationPipe(
    { whitelist: true, transform: true, forbidNonWhitelisted: true },
    { body: createDTO },
  );
  const updatePipe = new AbstractValidationPipe(
    { whitelist: true, transform: true, forbidNonWhitelisted: true },
    { body: updateDTO },
  );
  const queryPipe = new AbstractValidationPipe(
    { whitelist: true, transform: true, forbidNonWhitelisted: true },
    { query: queryStringDTO },
  );

  class BaseController<
    T,
    createDTO extends DeepPartial<T>,
    updateDTO extends QueryDeepPartialEntity<T>,
    queryStringDTO extends BaseQuerystringDto,
  > implements IBaseController<T, createDTO, updateDTO, queryStringDTO>
  {
    protected service: BaseService<T>;

    @Post()
    @UsePipes(createPipe)
    public create(@Body() data: createDTO) {
      return this.service.create(data);
    }

    @Get()
    @UsePipes(queryPipe)
    public findAll(@Query() queryString: queryStringDTO) {
      const filter = this.getFilters(queryString);

      return this.service.findAll(filter);
    }

    @Get(':uuid')
    findById(@Param('uuid', ParseUUIDPipe) uuid: string) {
      return this.service.findById(uuid);
    }

    @Patch(':uuid')
    @UsePipes(updatePipe)
    update(
      @Body() data: updateDTO,
      @Param('uuid', ParseUUIDPipe) uuid: string,
    ) {
      // @ts-ignore
      return this.service.update({ id: uuid }, data);
    }

    @Delete(':uuid')
    @HttpCode(204)
    remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
      // @ts-ignore
      return this.service.remove({ id: uuid });
    }

    getFilters(queryString: queryStringDTO) {
      const { take, skip, sortBy, orderBy, ...filter } = queryString;

      let order = undefined;

      if (orderBy && sortBy) {
        order = {
          [sortBy]: orderBy.toUpperCase(),
        };
      }

      return {
        pagination: {
          take,
          skip,
        },
        where: filter,
        order,
      };
    }
  }

  return BaseController;
}
