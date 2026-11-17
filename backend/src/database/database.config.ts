import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';

import type { DataSourceOptions } from 'typeorm';

export const readDatabaseOptions = (
  environment: NodeJS.ProcessEnv,
): DataSourceOptions => {
  const required = (name: string): string => {
    const value = environment[name]?.trim();
    if (!value)
      throw new Error(`Missing required environment variable: ${name}`);
    return value;
  };
  const portText = required('DB_PORT');
  const port = Number(portText);
  if (
    !/^\d+$/.test(portText) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  )
    throw new Error('DB_PORT must be an integer between 1 and 65535');

  return {
    type: 'postgres',
    host: required('DB_HOST'),
    port,
    username: required('DB_USER'),
    password: environment.DB_PASSWORD || undefined,
    database: required('DB_NAME'),
    entities: [],
    migrations: [resolve(__dirname, 'migrations', '*.js')],
    synchronize: false,
    migrationsRun: false,
    logging: false,
    connectTimeoutMS: 5000,
  };
};

export const createDatabaseOptions = (
  environment: NodeJS.ProcessEnv = process.env,
): DataSourceOptions => {
  // Both src/database and dist/database resolve to the same backend/.env.
  const envFile = resolve(__dirname, '..', '..', '.env');
  const localEnvironment = existsSync(envFile)
    ? parseEnv(readFileSync(envFile, 'utf8'))
    : {};
  // Merge explicitly instead of mutating process.env (also works in Jest).
  return readDatabaseOptions({ ...localEnvironment, ...environment });
};
