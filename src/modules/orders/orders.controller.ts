import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrdersService } from '@modules/orders/orders.service';
import { Order } from '@modules/orders/entities/order.entity';
import { ControllerFactory } from '@common/factories/controller.factory';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController extends ControllerFactory<
Order,
CreateOrderDto,
UpdateOrderDto,
null
>(CreateOrderDto, UpdateOrderDto, null) {
constructor(protected service: OrdersService) {
  super();
}
}