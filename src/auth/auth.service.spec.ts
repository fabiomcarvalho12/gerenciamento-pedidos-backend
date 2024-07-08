import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/entities/user.entity';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserRoles } from '@modules/users/constants';

describe('AuthService', () => {
  let service: AuthService;

  const userEntityResult = new User({
    id: '19675eae-e744-4b69-b283-0a89ffba8fcb',
    name: 'Test',
  });

  const loginResult = {
    id: '19675eae-e744-4b69-b283-0a89ffba8fcb',
    name: 'Test',
    accessToken: 'token',
  };

  const createUserDto: CreateUserDto = {
    name: 'new user',
    email: 'test@gmail.com',
    password: '123',
    birthDate: '1999-05-05',
    document: '12124455555',
    address: 'teste',
    phone: '31988888888',
    roles: UserRoles.ADMIN,
  };

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue(userEntityResult),
    create: jest.fn().mockResolvedValue(userEntityResult),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user by email and password', async () => {
      // Arrange
      const username = 'test@g.com';
      const pass = 'test-123';
      jest.spyOn(userEntityResult, 'validatePassword').mockResolvedValue(true);

      // Act
      const result = await service.validateUser(username, pass);

      // Assert
      expect(result).toEqual(userEntityResult);
      expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findOne).toHaveBeenCalledWith({
        where: { email: username },
      });
    });

    it('should validate a user by email/password with credentials wrong ', async () => {
      // Arrange
      jest.spyOn(userEntityResult, 'validatePassword').mockResolvedValue(false);

      // Act
      const result = await service.validateUser('', '');

      // Assert
      expect(result).toEqual(null);
    });

    it('should validate a user by email/password with non-existent email', async () => {
      // Arrange
      jest.spyOn(mockUsersService, 'findOne').mockResolvedValue(undefined);

      // Act
      const result = await service.validateUser('', '');

      // Assert
      expect(result).toEqual(null);
    });
  });

  describe('Login', () => {
    it('should login a user', async () => {
      // Act
      const result = await service.login(userEntityResult);

      // Assert
      expect(result).toEqual(loginResult);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
    });
  });

  describe('UserSignUp', () => {
    it('should sign-up a user', async () => {
      // Act
      const result = await service.userSignUp(createUserDto);

      // Assert
      expect(result).toEqual(userEntityResult);
      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an exception', async () => {
      // Arrange
      jest.spyOn(mockUsersService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      await expect(service.userSignUp(createUserDto)).rejects.toThrowError();
    });
  });
});
