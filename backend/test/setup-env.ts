// HTTP E2E must never silently use the development database from .env.
if (process.env.DB_NAME && process.env.DB_NAME !== 'tms_test') {
  throw new Error('HTTP E2E requires DB_NAME=tms_test');
}
process.env.DB_NAME = 'tms_test';
