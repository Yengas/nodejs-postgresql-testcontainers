import {PostgreSQLAdapter} from '../../../src/postgresql/postgresql.adapter';
import {
  AdvertisementRepository,
  AdvertisementWithProducts,
} from '../../../src/advertisement/advertisement.repository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postgreSQLAdapter: PostgreSQLAdapter = (global as any).postgreSQLAdapter;
const repository = new AdvertisementRepository(postgreSQLAdapter);

describe('AdvertisementRepository', () => {
  beforeEach(async () => {
    await postgreSQLAdapter.query('DELETE FROM advertisements');
    await postgreSQLAdapter.query('DELETE FROM advertisement_products');
  });

  const advertisementsWithProducts: AdvertisementWithProducts[] = [
    {
      id: '78a13697-bfdf-4f5f-96a4-c4a16f578c1d',
      sellerID: 968,
      isActive: true,
      startDateTime: new Date(10),
      endDateTime: new Date(20),
      products: [1, 2, 3],
    },
    {
      id: '886520a6-eb3b-4deb-9819-42f66e24f2d3',
      sellerID: 73,
      isActive: false,
      startDateTime: new Date(30),
      endDateTime: new Date(40),
      products: [4, 5, 6],
    },
  ];

  it('should do CRUD', async () => {
    await repository.insertAdvertisementsWithProducts(
      advertisementsWithProducts
    );

    const result = await repository.getAllAdvertisementsWithProducts();

    expect(result).toEqual(expect.arrayContaining(advertisementsWithProducts));
  });
});
