import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MONGO_MODULE_OPTIONS,
  MongoModuleClass,
  MongoModuleOptions,
} from './mongo.module-definition';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [MONGO_MODULE_OPTIONS],
      useFactory: (options: MongoModuleOptions) => ({
        uri: options.uri,
        dbName: options.dbName,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class MongoModule extends MongoModuleClass {}
