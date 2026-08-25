import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModuleOptions } from './mongo.module-definition';

interface MongoModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => MongoModuleOptions | Promise<MongoModuleOptions>;
  inject?: any[];
}

/**
 * Wrapper mỏng quanh MongooseModule.forRootAsync.
 * Nhận useFactory/inject của caller (thường inject ConfigService — global),
 * nên options token được resolve đúng trong context của MongooseCoreModule.
 */
@Module({})
export class MongoModule {
  static forRootAsync(options: MongoModuleAsyncOptions): DynamicModule {
    return {
      module: MongoModule,
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async (...args: any[]) => {
            const opts = await options.useFactory(...args);
            return { uri: opts.uri, dbName: opts.dbName };
          },
          inject: options.inject ?? [],
        }),
      ],
      exports: [MongooseModule],
    };
  }
}
