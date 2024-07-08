import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from '@modules/orders/orders.service';
import { OrdersController } from '@modules/orders/orders.controller';
import { Order } from '@modules/orders/entities/order.entity';
import { Item } from '@modules/items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Item])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}