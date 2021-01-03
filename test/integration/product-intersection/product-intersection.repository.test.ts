import {PostgreSQLAdapter} from '../../../src/postgresql/postgresql.adapter';
import {
  AdvertisementRepository,
  AdvertisementWithProducts,
} from '../../../src/advertisement/advertisement.repository';
import {ProductIntersectionRepository} from '../../../src/product-intersection/product-intersection.repository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postgreSQLAdapter: PostgreSQLAdapter = (global as any).postgreSQLAdapter;
const adRepository = new AdvertisementRepository(postgreSQLAdapter);
const repository = new ProductIntersectionRepository(postgreSQLAdapter);

describe('ProductIntersectionRepository', () => {
  const UUID_PREFIX = 'f4f4c9e3-a077-4f3c-bf73-9c54cb57ffa';

  beforeEach(async () => {
    await postgreSQLAdapter.query('DELETE FROM advertisements');
    await postgreSQLAdapter.query('DELETE FROM advertisement_products');
  });

  describe('.getActiveAdvertisementProducts()', () => {
    const SELLER_ID = 968;
    const OTHER_SELLER_ID = 73;

    const BASE_ADVERTISEMENT: AdvertisementWithProducts = {
      id: UUID_PREFIX + '0',
      sellerID: OTHER_SELLER_ID,
      isActive: false,
      startDateTime: new Date(0),
      endDateTime: new Date(0),
      products: [],
    };

    it('should only return products for given sellers active products', async () => {
      const advertisements: AdvertisementWithProducts[] = [
        {
          ...BASE_ADVERTISEMENT,
          id: UUID_PREFIX + '1',
          sellerID: SELLER_ID,
          isActive: true,
          products: [1, 2, 3],
        },
        {
          ...BASE_ADVERTISEMENT,
          id: UUID_PREFIX + '2',
          sellerID: SELLER_ID,
          isActive: false,
          products: [4, 5, 6],
        },
        {
          ...BASE_ADVERTISEMENT,
          id: UUID_PREFIX + '3',
          sellerID: OTHER_SELLER_ID,
          isActive: true,
          products: [7, 8, 9],
        },
      ];

      const expectedResult = [advertisements[0]];

      await adRepository.insertAdvertisementsWithProducts(advertisements);

      const result = await repository.getActiveAdvertisementProducts({
        sellerID: SELLER_ID,
      });

      expect(result).toEqual(expectedResult);
    });
  });
});
