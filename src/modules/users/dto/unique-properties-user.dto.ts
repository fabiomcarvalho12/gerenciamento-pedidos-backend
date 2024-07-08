import { UniqueUserEmail, UniqueUserDocument } from '../users.decorator';
import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

export class UniquePropertiesUserDto {
  @UniqueUserEmail()
  @IsEmail()
  @IsNotEmpty()
  @ValidateIf((obj) => !obj.document || obj.email)
  email: string;

  @UniqueUserDocument()
  @IsNotEmpty()
  @ValidateIf((obj) => !obj.email || obj.document)
  document: string;
}
