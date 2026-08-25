import { Module } from '@nestjs/common';
import { OrderModule } from '@app/order';
import { OrdersController } from './orders.controller';

@Module({
  imports: [OrderModule],
  controllers: [OrdersController],
})
export class OrdersModule {}
