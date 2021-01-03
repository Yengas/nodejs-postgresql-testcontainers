import {PostgreSQLAdapter, Query} from '../postgresql/postgresql.adapter';

// dummy repository for advertisement CRUD
export class AdvertisementRepository {
  constructor(private readonly postgreSQLAdapter: PostgreSQLAdapter) {}

  async getAllAdvertisementsWithProducts(): Promise<
    AdvertisementWithProducts[]
  > {
    const {rows} = await this.postgreSQLAdapter
      .query<AdvertisementWithProducts>(`
        SELECT 
          a.id as "id", a.seller_id as "sellerID", a.is_active as "isActive", a.start_date_time as "startDateTime", a.end_date_time as "endDateTime",
          json_agg(ap.product_id) as products
        FROM advertisements as a
        INNER JOIN advertisement_products ap ON ap.advertisement_id = a.id
        GROUP BY a.id
      `);

    return rows;
  }

  async insertAdvertisementsWithProducts(
    advertisementsWithProducts: AdvertisementWithProducts[]
  ): Promise<void> {
    const queries = advertisementsWithProducts.reduce<Query[]>(
      (allQueries, advertisement) => [
        ...allQueries,
        AdvertisementRepository.advertisementInsertQuery(advertisement),
        ...advertisement.products.map(productID =>
          AdvertisementRepository.productInsertQuery(
            advertisement.id,
            productID
          )
        ),
      ],
      []
    );

    return this.postgreSQLAdapter.multipleQueryInTransaction(queries);
  }

  private static advertisementInsertQuery(
    advertisement: AdvertisementWithProducts
  ): Query {
    const {id, sellerID, isActive, startDateTime, endDateTime} = advertisement;
    const params = [id, sellerID, isActive, startDateTime, endDateTime];

    return {
      sql:
        'INSERT INTO advertisements (id, seller_id, is_active, start_date_time, end_date_time) VALUES ($1, $2, $3, $4, $5)',
      params,
    };
  }

  private static productInsertQuery(
    advertisementID: string,
    productID: number
  ): Query {
    return {
      sql:
        'INSERT INTO advertisement_products (advertisement_id, product_id) VALUES ($1, $2)',
      params: [advertisementID, productID],
    };
  }
}

export type Advertisement = {
  id: string;
  sellerID: number;
  isActive: boolean;
  startDateTime: Date;
  endDateTime: Date;
};

export type AdvertisementWithProducts = Advertisement & {
  products: number[];
};
