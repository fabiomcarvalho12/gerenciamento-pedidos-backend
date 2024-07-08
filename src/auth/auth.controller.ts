import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('sign-up')
  async userSignUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.userSignUp(createUserDto);
  }
}
