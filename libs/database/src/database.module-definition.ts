import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface DatabaseModuleOptions {
  type?: 'mysql' | 'postgres' | 'mariadb';
  host: string;
  port: number;
  username: string;
  password?: string;
  database: string;
  synchronize?: boolean;
}

export const {
  ConfigurableModuleClass: DatabaseModuleClass,
  MODULE_OPTIONS_TOKEN: DATABASE_MODULE_OPTIONS,
  ASYNC_OPTIONS_TYPE: DatabaseModuleAsyncOptions,
  OPTIONS_TYPE: DatabaseModuleOptionsType,
} = new ConfigurableModuleBuilder<DatabaseModuleOptions>()
  .setClassMethodName('forRoot') // -> DatabaseModule.forRoot / forRootAsync
  .build();
