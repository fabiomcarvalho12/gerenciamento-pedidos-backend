import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@modules/users/entities/user.entity';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserRoles } from '@modules/users/constants';

describe('AuthController', () => {
  let authController: AuthController;

  const loginResult = {
    id: '19675eae-e744-4b69-b283-0a89ffba8fcb',
    name: 'Test',
    accessToken:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3M2EzMTY5Mi00ZjRmLTQ3ZmItOWZmMi04NjM1OTQ3Y2RkZTQiLCJpYXQiOjE2NDk2OTc5MjIsImV4cCI6MTY0OTc4NDMyMn0.EClgCSBFbmua060vjwnPlaPosdeeWCXTSU_eWUxBkOuCM6ZXzzLwsTR1ezubl_rbYHQFsE2IlrxmzQpQQnMlX9qcuMwKUv39ejmPoJjIC6115pPNm4na9n56ZKZbnIGyYlajFNxo5oXj8S1JWVVfH5hentEo53vZXMFIaY0WsgSoFqz1eNqbJ4Ar-WRmwAkfpmmfvnNnszi4SzNsMRCwzKHw1TECRZIKAEt21X9FPBLmB-_zGAia5_w_6h9zOs_bx3JIrg4APQ7QI-Djg_JXAALANbOueMamL8G48Ui9TEUZzdwMA-N1yv2QRJR0YtlFUuoBGyfOuDh-ljAfAAOwoyf0y2L4uuMLEySI8njLFlTjA8pwIrdY4MM4CHROzJl25u-nvSfmrqTuwKdwmXmFuW51CO3HO-u115NegnZTGh4Y-cQBDrwqvxkchOfwGCOgEU3cPOT8iVWAQqsuERvRXplEVgayxsEWXOC469wG5pKGshYIOT26_AJEJHr76jNf',
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

  const newUser = new User(createUserDto);

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue({}),
    login: jest.fn().mockResolvedValue(loginResult),
    userSignUp: jest.fn().mockResolvedValue(newUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('Login', () => {
    it('should login a user', async () => {
      // Arrange
      const user = new User();
      const req = { user };

      // Act
      const result = await authController.login(req);

      // Assert
      expect(result).toEqual(loginResult);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });
  });

  describe('UserSignUp', () => {
    it('should sign-up a user', async () => {
      // Act
      const result = await authController.userSignUp(createUserDto);

      // Assert
      expect(result).toEqual(newUser);
      expect(mockAuthService.userSignUp).toHaveBeenCalledTimes(1);
      expect(mockAuthService.userSignUp).toHaveBeenCalledWith(createUserDto);
    });
  });
});
