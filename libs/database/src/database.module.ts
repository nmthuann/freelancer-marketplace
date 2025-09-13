import { Module } from '@nestjs/common';
import {
  DATABASE_MODULE_OPTIONS,
  DatabaseModuleClass,
  DatabaseModuleOptions,
} from './database.module-definition';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [DATABASE_MODULE_OPTIONS],
      useFactory: (options: DatabaseModuleOptions) => ({
        type: options.type || 'mysql',
        host: options.host,
        port: options.port,
        username: options.username,
        password: options.password,
        database: options.database,
        synchronize: options.synchronize ?? false, // entities sẽ khai báo ở service
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule extends DatabaseModuleClass {}
