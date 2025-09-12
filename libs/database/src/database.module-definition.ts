import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface DatabaseModuleOptions {
  host: string;
  port: number;
  username?: string;
  password?: string;
  database?: string;
}

export const {
  ConfigurableModuleClass: DatabaseModuleClass,
  MODULE_OPTIONS_TOKEN: DATABASE_MODULE_OPTIONS,
  ASYNC_OPTIONS_TYPE: DatabaseModuleAsyncOptions,
  OPTIONS_TYPE: DatabaseModuleOptionsType,
} = new ConfigurableModuleBuilder<DatabaseModuleOptions>()
  .setClassMethodName('forRoot') // => sẽ có DatabaseModule.forRoot / forRootAsync
  .build();
