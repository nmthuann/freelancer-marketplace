import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoModule } from '@app/mongo';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    MongoModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('USER_MONGO_URI'),
        dbName: config.get('USER_MONGO_DB_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
// apps/user-service/src/app.module.ts
