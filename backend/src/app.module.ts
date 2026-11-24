import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createDatabaseOptions } from './database/database.config';
import { ApiExceptionFilter } from './http/api-exception.filter';
import { createRequestValidationPipe } from './http/request-validation.pipe';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...createDatabaseOptions(), retryAttempts: 1 }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useFactory: createRequestValidationPipe },
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
  ],
})
export class AppModule {}
