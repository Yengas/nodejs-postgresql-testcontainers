import {PostgreSQLAdapter} from '../../../src/postgresql/postgresql.adapter';
import {AdvertisementRepository} from '../../../src/advertisement/advertisement.repository';
import {ProductIntersectionRepository} from '../../../src/product-intersection/product-intersection.repository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postgreSQLAdapter: PostgreSQLAdapter = (global as any).postgreSQLAdapter;
const advertisementRepository = new AdvertisementRepository(postgreSQLAdapter);
const repository = new ProductIntersectionRepository(postgreSQLAdapter);

describe('ProductIntersectionRepository', () => {
  beforeEach(async () => {
    await postgreSQLAdapter.query('DELETE FROM advertisements');
    await postgreSQLAdapter.query('DELETE FROM advertisement_products');
  });
});
