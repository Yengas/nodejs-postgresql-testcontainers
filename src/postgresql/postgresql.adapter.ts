import {Pool, QueryResult} from 'pg';
import {PostgreSQLConfig} from './postgresql.config';

export class PostgreSQLAdapter {
  private pool: Pool | undefined;

  constructor(private readonly config: PostgreSQLConfig) {}

  public async query<T>(
    query: string,
    params: unknown[] = []
  ): Promise<QueryResult<T>> {
    return this.pool!.query(query, params);
  }

  public async multipleQueryInTransaction(queries: Query[]): Promise<void> {
    const client = await this.pool!.connect();

    try {
      await client.query('BEGIN');

      for (const query of queries) {
        await client.query(query.sql, query.params);
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  public async connect(): Promise<void> {
    const pool = new Pool({
      connectionString: this.config.uri,
    });

    try {
      await pool.query('SELECT NOW();');
    } catch (err) {
      throw new Error(
        `PostgreSQL could not execute dummy query. Error: ${err.message}`
      );
    }

    this.pool = pool;
  }

  public async close(): Promise<void> {
    await this.pool!.end();
  }
}

export type Query = {
  sql: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[];
};
