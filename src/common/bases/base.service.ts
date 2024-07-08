import {
  DeepPartial,
  FindOneOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';
import { FindOptionsSelect } from 'typeorm/find-options/FindOptionsSelect';
import { EntityNotExistError } from '../errors/entity-not-exist.error';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

interface IListOptions<TEntity> {
  where?:
    | FindOptionsWhere<TEntity>[]
    | FindOptionsWhere<TEntity>
    | ObjectLiteral;
  relations?: FindOptionsRelations<TEntity>;
  order?: FindOptionsOrder<TEntity>;
  pagination?: { skip?: number; take?: number };
  select?: FindOptionsSelect<TEntity>;
}

export abstract class BaseService<TEntity> {
  protected constructor(
    protected readonly entityClass: string,
    protected readonly repository: Repository<TEntity>,
  ) {}

  async create(createDto: DeepPartial<TEntity>) {
    return this.repository.save(
      this.repository.create(createDto) as DeepPartial<TEntity>,
    );
  }

  async upsert(
    conditions: FindOptionsWhere<TEntity>,
    createOrUpdateDto: DeepPartial<TEntity>,
  ) {
    let entityExist = await this.repository.findOne({
      where: conditions,
    });

    if (entityExist) {
      entityExist = { ...entityExist, ...createOrUpdateDto };

      return this.repository.save(entityExist as DeepPartial<TEntity>);
    }

    return this.repository.save(
      this.repository.create(createOrUpdateDto) as DeepPartial<TEntity>,
    );
  }

  async findAll(options: IListOptions<TEntity>) {
    return this.findAndCount(options);
  }

  async findOne(options: IListOptions<TEntity>): Promise<TEntity> {
    return this.repository.findOne(options as FindOneOptions<TEntity>);
  }

  async findById(id: string): Promise<TEntity> {
    const entityExist = await this.repository.findOne({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      where: { id },
    });

    if (!entityExist) {
      throw new EntityNotExistError(this.entityClass);
    }

    return entityExist;
  }

  async update(
    criteria: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
    updateDto: DeepPartial<TEntity>,
  ) {
    const entityExist = await this.repository.findOne({
      where: criteria,
    });

    if (!entityExist) {
      throw new EntityNotExistError(this.entityClass);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await this.repository.update(entityExist.id, updateDto);

    return updateDto;
  }

  async remove(
    criteria: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
  ) {
    const entityExist = await this.repository.findOne({
      where: criteria,
    });

    if (!entityExist) {
      throw new EntityNotExistError(this.entityClass);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return this.repository.delete(entityExist.id);
  }

  private async findAndCount(options: IListOptions<TEntity>) {
    const { where, pagination, order, relations } = this.getQuery(options);

    const [result, count] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<TEntity>[] | FindOptionsWhere<TEntity>,
      relations,
      order,
      ...pagination,
    });

    return {
      count,
      data: result,
    };
  }

  private getQuery(options: IListOptions<TEntity>) {
    const { order, relations, where, pagination } = options;
    const defaultQueryLimitNumber =
      parseInt(process.env.DEFAULT_QUERY_LIMIT_NUMBER) ?? 100;

    if (pagination.take >= defaultQueryLimitNumber) {
      pagination.take = defaultQueryLimitNumber;
    }

    return { where, pagination, order, relations };
  }
}
