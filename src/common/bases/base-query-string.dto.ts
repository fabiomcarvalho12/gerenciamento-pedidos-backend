import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum orderByEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BaseQuerystringDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  take?: number = 100;

  @ValidateIf(
    (o) => o.orderBy === orderByEnum.DESC || o.orderBy === orderByEnum.ASC,
  )
  @Type(() => String)
  @IsString()
  sortBy?: string;

  @IsEnum(orderByEnum, {
    message: `orderBy must be ${orderByEnum.ASC} or ${orderByEnum.DESC}`,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  orderBy?: orderByEnum;

  constructor(skip = 0, take = 100, sortBy, orderBy) {
    this.skip = skip;
    this.take = take;
    this.sortBy = sortBy;
    this.orderBy = orderBy;
  }
}
