import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UniqueUserEmailValidator } from './validators/unique-user-email.validator';
import { UniqueUserDocumentValidator } from './validators/unique-user-document.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UniqueUserEmailValidator,
    UniqueUserDocumentValidator,
  ],
  exports: [UsersService],
})
export class UsersModule {}
