import { existsSync, readFileSync } from 'node:fs';

import { createDatabaseOptions, readDatabaseOptions } from './database.config';

jest.mock('node:fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

const environment: NodeJS.ProcessEnv = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'vas',
  DB_NAME: 'tms_test',
};

describe('database configuration', () => {
  afterEach(() => jest.resetAllMocks());
  it('uses explicit environment settings without automatic schema changes', () => {
    expect(readDatabaseOptions(environment)).toMatchObject({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'vas',
      database: 'tms_test',
      synchronize: false,
      migrationsRun: false,
      entities: [],
      logging: false,
    });
  });

  it.each(['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME'])(
    'rejects missing %s without disclosing environment values',
    (name) => {
      expect(() => readDatabaseOptions({ ...environment, [name]: '' })).toThrow(
        `Missing required environment variable: ${name}`,
      );
    },
  );

  it.each(['0', '65536', '1.5', '5432invalid'])(
    'rejects invalid ports (%s)',
    (port) => {
      expect(() =>
        readDatabaseOptions({ ...environment, DB_PORT: port }),
      ).toThrow('DB_PORT must be an integer between 1 and 65535');
    },
  );
  it('merges the local env file with process overrides without changing process.env', () => {
    jest.mocked(existsSync).mockReturnValue(true);
    jest
      .mocked(readFileSync)
      .mockReturnValue(
        'DB_HOST=localhost\nDB_PORT=5432\nDB_USER=vas\nDB_NAME=tms_dev\n',
      );
    const before = process.env.DB_NAME;
    expect(createDatabaseOptions({ DB_NAME: 'tms_test' })).toMatchObject({
      database: 'tms_test',
      host: 'localhost',
      port: 5432,
      username: 'vas',
    });
    expect(process.env.DB_NAME).toBe(before);
  });

  it('uses supplied settings when the local env file is absent', () => {
    jest.mocked(existsSync).mockReturnValue(false);
    expect(createDatabaseOptions(environment)).toMatchObject({
      database: 'tms_test',
    });
    expect(readFileSync).not.toHaveBeenCalled();
  });
});
