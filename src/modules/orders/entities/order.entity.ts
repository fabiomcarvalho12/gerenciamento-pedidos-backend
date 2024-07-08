import { BaseEntity } from '@common/bases/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Item } from '@modules/items/entities/item.entity';

@Entity({ name: 'order' })
export class Order extends BaseEntity {
  @Column()
  orderId: string;

  @Column()
  value: number;

  @OneToMany(() => Item, item => item.order, { cascade: true })
  items: Item[];
}