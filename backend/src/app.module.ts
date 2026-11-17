import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createDatabaseOptions } from './database/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...createDatabaseOptions(), retryAttempts: 1 }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
