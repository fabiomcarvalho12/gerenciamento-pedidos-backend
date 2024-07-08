import { Item } from '@modules/items/entities/item.entity';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsNotEmpty()
  items: Item[];
}