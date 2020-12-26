import {PostgreSQLAdapter} from '../../../src/postgresql/postgresql.adapter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postgreSQLAdapter: PostgreSQLAdapter = (global as any).postgreSQLAdapter;

describe('PostgreSQLAdapter', () => {
  describe('.query()', () => {
    it('should query with parameters', async () => {
      // Arrange
      const query = 'SELECT ($1 + 5) as res';
      const params = [73];

      const expectedResult = 78;

      // Act
      const result = await postgreSQLAdapter.query<{res: number}>(
        query,
        params
      );

      // Assert
      expect(result.rows[0]?.res).toBe(expectedResult);
    });
  });
});
