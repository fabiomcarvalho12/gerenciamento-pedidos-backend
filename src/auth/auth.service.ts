import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@modules/users/entities/user.entity';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UsersService } from '@modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({
      where: { email: username },
    });

    if (await user?.validatePassword(pass)) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id };

    return {
      id: user.id,
      name: user.name,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async userSignUp(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
