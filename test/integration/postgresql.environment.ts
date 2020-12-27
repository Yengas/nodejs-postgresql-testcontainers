import {join} from 'path';
import {TestcontainersEnvironment} from '@trendyol/jest-testcontainers';
import migration from 'node-pg-migrate';
import {PostgreSQLAdapter} from '../../src/postgresql/postgresql.adapter';
import {PostgreSQLConfig} from '../../src/postgresql/postgresql.config';

class PostgreSQLEnvironment extends TestcontainersEnvironment {
  private static readonly MIGRATION_DIR = join(__dirname, '../../migrations');
  private static readonly MIGRATION_TABLE = 'pgmirations';

  private static readonly POSTGRESQL_DB = 'postgres';
  private static readonly POSTGRESQL_AUTH = 'postgres:integration-pass';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private postgreSQLAdapter: PostgreSQLAdapter = undefined as any;

  async setup() {
    await super.setup();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globals: any = (this as any).global;

    const uri = `postgresql://${PostgreSQLEnvironment.POSTGRESQL_AUTH}@${globals.__TESTCONTAINERS_POSTGRE_IP__}:${globals.__TESTCONTAINERS_POSTGRE_PORT_5432__}/${PostgreSQLEnvironment.POSTGRESQL_DB}`;
    const postgreSQLConfig: PostgreSQLConfig = {uri};
    const postgreSQLAdapter = new PostgreSQLAdapter(postgreSQLConfig);

    await postgreSQLAdapter.connect();
    await migration({
      databaseUrl: uri,
      dir: PostgreSQLEnvironment.MIGRATION_DIR,
      migrationsTable: PostgreSQLEnvironment.MIGRATION_TABLE,
      direction: 'up',
      count: 999,
    });

    globals.postgreSQLAdapter = postgreSQLAdapter;
    this.postgreSQLAdapter = postgreSQLAdapter;
  }

  async teardown() {
    await super.teardown();
    this.postgreSQLAdapter && (await this.postgreSQLAdapter.close());
  }
}

module.exports = PostgreSQLEnvironment;
