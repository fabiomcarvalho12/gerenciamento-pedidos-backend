import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JWT_ACCESS_TOKEN_PARAMS } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      privateKey: JWT_ACCESS_TOKEN_PARAMS.privateKey,
      publicKey: JWT_ACCESS_TOKEN_PARAMS.publicKey,
      signOptions: {
        expiresIn: JWT_ACCESS_TOKEN_PARAMS.options.expiresIn,
        algorithm: JWT_ACCESS_TOKEN_PARAMS.options.algorithm,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
