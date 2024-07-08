import { IsEmail,IsNotEmpty } from 'class-validator';
import { UniqueUserDocument, UniqueUserEmail } from '../users.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @UniqueUserEmail()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @UniqueUserDocument()
  @IsNotEmpty()
  document: string;
}
