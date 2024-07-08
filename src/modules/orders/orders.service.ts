import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@modules/orders/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }

  findOne(orderId: string): Promise<Order> {
    return this.orderRepository.findOne({where: {id: orderId}});
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items'] });
  }

  async update(orderId: string, order: Partial<Order>): Promise<void> {
    const existingOrder = await this.orderRepository.findOne({where: {id: orderId}});
    if (existingOrder) {
      await this.orderRepository.save({ ...existingOrder, ...order });
    }
  }

  async remove(orderId: string): Promise<void> {
    await this.orderRepository.delete(orderId);
  }
}
