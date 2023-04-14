import { AggregateRoot } from '../../../domain/AggregateRoot';
import { Criteria } from '../../../domain/criteria/Criteria';
import { MongoCriteriaConverter } from './MongoCriteriaConverter';
import mongoose from 'mongoose';

export abstract class MongooseRepository<T extends AggregateRoot> {
  private criteriaConverter: MongoCriteriaConverter;

  protected constructor() {
    this.criteriaConverter = new MongoCriteriaConverter();
  }

  protected abstract model(): mongoose.Model<any>;

  protected async persist(id: string, aggregateRoot: T): Promise<void> {
    const collection = await this.model();

    const document = {
      ...aggregateRoot.toPrimitives(),
      _id: id,
      id: undefined,
    };

    await collection.updateOne(
      { _id: id },
      { $set: document },
      { upsert: true },
    );
  }

  protected async searchByCriteria<D extends AggregateRoot>(
    criteria: Criteria,
  ): Promise<D[]> {
    const query = this.criteriaConverter.convert(criteria);

    const model = await this.model();

    return model
      .find<D>(query.filter, {})
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit);
  }
}
