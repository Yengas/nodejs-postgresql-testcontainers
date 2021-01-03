import {PostgreSQLAdapter} from '../postgresql/postgresql.adapter';
import {AdvertisementWithProducts} from '../advertisement/advertisement.repository';

export class ProductIntersectionRepository {
  constructor(private readonly postgreSQLAdapter: PostgreSQLAdapter) {}

  async getActiveAdvertisementProducts(
    query: ProductIntersectionQuery
  ): Promise<AdvertisementWithProducts[]> {
    const sql = `
      SELECT
        a.id as "id", a.seller_id as "sellerID", a.is_active as "isActive", a.start_date_time as "startDateTime", a.end_date_time as "endDateTime",
        json_agg(ap.product_id) as products
      FROM advertisements as a
      INNER JOIN advertisement_products ap ON ap.advertisement_id = a.id
      WHERE
        a.seller_id = $1
        AND a.is_active = true
      GROUP BY a.id
    `;
    const params = [query.sellerID];

    const {
      rows,
    } = await this.postgreSQLAdapter.query<AdvertisementWithProducts>(
      sql,
      params
    );

    return rows;
  }
}

type ProductIntersectionQuery = {
  sellerID: number;
};
