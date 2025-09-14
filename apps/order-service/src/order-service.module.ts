import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('FREELANCER_MARKETPLACE_ORDER_DB_HOST'),
        port: parseInt(
          config.get<string>('FREELANCER_MARKETPLACE_ORDER_DB_PORT'),
          10,
        ),
        username: config.get<string>(
          'FREELANCER_MARKETPLACE_ORDER_DB_USERNAME',
        ),
        password: config.get<string>(
          'FREELANCER_MARKETPLACE_ORDER_DB_PASSWORD',
        ),
        database: config.get<string>(
          'FREELANCER_MARKETPLACE_ORDER_DB_DATABASE_NAME',
        ),
        synchronize: true,
      }),
    }),

    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class OrderServiceModule {}
