import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { createDatabaseOptions } from './database.config';

export default new DataSource(createDatabaseOptions());
