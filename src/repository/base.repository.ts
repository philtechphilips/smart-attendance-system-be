import {
  DeepPartial,
  Repository,
  FindOptionsWhere,
  DeleteResult,
  FindManyOptions,
  SelectQueryBuilder,
  FindOptionsRelations,
} from 'typeorm';

export abstract class BaseRepository<T> {
  constructor(protected readonly entity: Repository<T>) {}

  async findOne(
    entityFilterQuery: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    projection?: Record<string, any>,
  ): Promise<T | undefined> {
    return this.entity.findOne({
      where: entityFilterQuery,
      relations: relations,
      select: projection,
    });
  }

  async find(
    entityFilterQuery: FindOptionsWhere<T> | FindManyOptions<T>,
  ): Promise<T[]> {
    return this.entity.find(entityFilterQuery);
  }

  async findAll(relations: string[] = []): Promise<T[]> {
    return this.entity.find({ relations });
  }

  async create(createEntityData: DeepPartial<T>): Promise<T> {
    const entity = this.entity.create(createEntityData);
    return this.entity.save(entity);
  }

  async findOneAndUpdate(
    entityFilterQuery: FindOptionsWhere<T>,
    updateEntityData: Partial<unknown>,
  ): Promise<T | undefined> {
    await this.entity.update(entityFilterQuery, updateEntityData);
    return this.entity.findOne({ where: entityFilterQuery });
  }

  async deleteMany(entityFilterQuery: FindOptionsWhere<T>): Promise<boolean> {
    const result: DeleteResult = await this.entity.delete(entityFilterQuery);
    return result.affected! > 0;
  }

  async createQueryBuilder(alias?: string): Promise<SelectQueryBuilder<T>> {
    return this.entity.createQueryBuilder(alias);
  }
}
