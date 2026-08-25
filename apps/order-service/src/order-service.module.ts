import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoModule } from '@app/mongo';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    MongoModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('ORDER_MONGO_URI'),
        dbName: config.get('ORDER_MONGO_DB_NAME'),
      }),
      inject: [ConfigService],
    }),

    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class OrderServiceModule {}
