import { BaseQuerystringDto } from '@common/bases/base-query-string.dto';
import { IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ILike } from 'typeorm';

export class QueryStringUserDto extends BaseQuerystringDto {
  @Transform(({ value }) => ILike(`%${value}%`))
  @IsOptional()
  name?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  email?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  document?: string;
}
