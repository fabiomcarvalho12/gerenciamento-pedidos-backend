import {Controller} from '@nestjs/common';
import { ControllerFactory } from '@common/factories/controller.factory';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryStringUserDto } from './dto/query-string-user.dto';


@Controller('users')
export class UsersController extends ControllerFactory<
  User,
  CreateUserDto,
  UpdateUserDto,
  QueryStringUserDto
>(CreateUserDto, UpdateUserDto, QueryStringUserDto) {
  constructor(protected service: UsersService) {
    super();
  }

}
