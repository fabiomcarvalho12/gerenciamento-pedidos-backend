import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'UniqueUserEmail', async: true })
@Injectable()
export class UniqueUserEmailValidator implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(email: string) {
    const user = await this.usersService.findOne({
      where: { email },
      select: { email: true },
    });

    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return `Email already exists`;
  }
}
