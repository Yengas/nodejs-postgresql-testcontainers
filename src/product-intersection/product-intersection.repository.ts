import {PostgreSQLAdapter} from '../postgresql/postgresql.adapter';
import {AdvertisementWithProducts} from '../advertisement/advertisement.repository';

export class ProductIntersectionRepository {
  constructor(private readonly postgreSQLAdapter: PostgreSQLAdapter) {}

  async getActiveAdvertisementProducts(): Promise<AdvertisementWithProducts[]> {
    throw new Error('not implemented');
  }
}
