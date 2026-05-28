import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface MongoModuleOptions {
  uri: string;
  dbName?: string;
}

export const {
  ConfigurableModuleClass: MongoModuleClass,
  MODULE_OPTIONS_TOKEN: MONGO_MODULE_OPTIONS,
} = new ConfigurableModuleBuilder<MongoModuleOptions>()
  .setClassMethodName('forRoot')
  .build();
