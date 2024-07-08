import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'UniqueUserDocument', async: true })
@Injectable()
export class UniqueUserDocumentValidator
  implements ValidatorConstraintInterface
{
  constructor(private usersService: UsersService) {}

  async validate(document: string) {
    const user = await this.usersService.findOne({
      where: { document },
      select: { document: true },
    });

    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return `Document already exists`;
  }
}
