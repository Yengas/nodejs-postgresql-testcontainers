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
  const UUID_PREFIX_2 = 'f4f4c9e3-a077-4f3c-bf73-9c54cb57ffb';

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
        startDateTime: BASE_ADVERTISEMENT.startDateTime,
        endDateTime: BASE_ADVERTISEMENT.endDateTime,
      });

      expect(result).toEqual(expectedResult);
    });

    it('should only return products for advertisements in intersecting times', async () => {
      const startDateTime = new Date(5);
      const endDateTime = new Date(10);

      // all advertisements are active and for are owned by our seller
      const baseAdvertisement = {
        ...BASE_ADVERTISEMENT,
        sellerID: SELLER_ID,
        isActive: true,
      };

      const intersectingAdvertisements: AdvertisementWithProducts[] = [
        {
          ...baseAdvertisement,
          id: UUID_PREFIX + '1',
          startDateTime: new Date(4),
          endDateTime: new Date(5),
          products: [1, 2, 3],
        },
        {
          ...baseAdvertisement,
          id: UUID_PREFIX + '2',
          startDateTime: new Date(6),
          endDateTime: new Date(7),
          products: [2, 3, 4],
        },
        {
          ...baseAdvertisement,
          id: UUID_PREFIX + '3',
          startDateTime: new Date(10),
          endDateTime: new Date(11),
          products: [5, 6, 7],
        },
        {
          ...baseAdvertisement,
          id: UUID_PREFIX + '4',
          startDateTime: new Date(4),
          endDateTime: new Date(11),
          products: [7, 8, 9],
        },
      ];

      const nonIntersectingAdvertisements: AdvertisementWithProducts[] = [
        {
          ...baseAdvertisement,
          id: UUID_PREFIX_2 + '1',
          startDateTime: new Date(4),
          endDateTime: new Date(4),
          products: [10, 11],
        },
        {
          ...baseAdvertisement,
          id: UUID_PREFIX_2 + '2',
          startDateTime: new Date(11),
          endDateTime: new Date(11),
          products: [12, 13],
        },
      ];

      await adRepository.insertAdvertisementsWithProducts([
        ...intersectingAdvertisements,
        ...nonIntersectingAdvertisements,
      ]);

      const result = await repository.getActiveAdvertisementProducts({
        sellerID: SELLER_ID,
        startDateTime,
        endDateTime,
      });

      expect(result).toEqual(
        expect.arrayContaining(intersectingAdvertisements)
      );
    });
  });
});
