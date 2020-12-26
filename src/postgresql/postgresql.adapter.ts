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
