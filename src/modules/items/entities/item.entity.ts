import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/bases/base.entity';
import { Order } from '@modules/orders/entities/order.entity';

@Entity({ name: 'item' })
export class Item extends BaseEntity {

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column({type: 'decimal', precision: 15, scale: 2})
  price: number;

  @ManyToOne(() => Order, order => order.items)
  order: Order;
}