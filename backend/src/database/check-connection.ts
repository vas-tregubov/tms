import dataSource from './data-source';

const checkConnection = async (): Promise<void> => {
  try {
    await dataSource.initialize();
    const result =
      await dataSource.query<{ value: number }[]>('SELECT 1 AS value');
    if (result[0]?.value !== 1)
      throw new Error('Unexpected connection check result');
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
};

void checkConnection()
  .then(() => console.log('PostgreSQL connection check passed (SELECT 1).'))
  .catch(() => {
    // Never print credentials or driver configuration in CLI output.
    console.error(
      'PostgreSQL connection check failed. Verify DB_* settings and server availability.',
    );
    process.exitCode = 1;
  });
