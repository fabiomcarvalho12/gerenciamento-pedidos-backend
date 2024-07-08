import { DeleteResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { FilesUploadService } from '@providers/files-upload/files-upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoles } from './constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityNotExistError } from '@common/errors/entity-not-exist.error';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { UnprocessableEntityError } from '@common/errors/unprocessable-entity.error';
import { RolesService } from '@modules/users/roles.service';

describe('UsersService', () => {
  let usersService: UsersService;

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

  const updateUserDto: UpdateUserDto = {
    name: 'test-1',
    email: 'testUpdate@gmail.com',
  };

  const updatedUserEntity = new User(updateUserDto);

  const userEntityList: User[] = [
    new User({
      name: 'test-1',
      password: '$2a$12$NZCFT/zxFC/Jm8a3f8KfhuaReYXGacadV92/5Rxa5P6dF.6CnQsFq',
    }),
    new User({ name: 'test-2' }),
    new User({ name: 'test-3' }),
  ];

  const changePasswordUserDto: ChangePasswordUserDto = {
    userId: userEntityList[0].id,
    currentPassword: '123',
    newPassword: 'abc',
  };

  const findAllResult = {
    count: userEntityList.length,
    data: userEntityList,
  };

  const uploadBufferResult = {
    mimetype: 'image',
    url: 'https://local-storage/image.png',
  };

  const mockUsersRepository = {
    save: jest.fn().mockResolvedValue(userEntityList[0]),
    create: jest.fn().mockReturnValue(userEntityList[0]),
    findAndCount: jest
      .fn()
      .mockResolvedValue([userEntityList, userEntityList.length]),
    findOne: jest.fn().mockResolvedValue(userEntityList[0]),
    update: jest.fn().mockResolvedValue(updatedUserEntity),
    delete: jest.fn().mockResolvedValue(DeleteResult),
  };

  const mockFilesUploadService = {
    uploadBuffer: jest.fn().mockResolvedValue(uploadBufferResult),
    uploadBase64: jest.fn(),
    deleteFile: jest.fn(),
  };
  const mockRolesService = {
    setUserRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        { provide: FilesUploadService, useValue: mockFilesUploadService },
        { provide: RolesService, useValue: mockRolesService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('Create', () => {
    it('should create a user', async () => {
      //Act
      const result = await usersService.create(createUserDto);

      //Assert
      expect(result).toEqual(userEntityList[0]);
      expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an exception', async () => {
      // Arrange
      jest
        .spyOn(mockUsersRepository, 'save')
        .mockRejectedValueOnce(new Error());

      //Assert
      await expect(usersService.create(createUserDto)).rejects.toThrowError();
    });
  });

  describe('SaveAvatar', () => {
    it('should save an avatar for a user', async () => {
      // Arrange
      const file: Express.Multer.File = '' as any;

      //Act
      const result = await usersService.saveAvatar(userEntityList[1].id, file);

      //Assert
      expect(result).toEqual(uploadBufferResult);
      expect(mockFilesUploadService.uploadBuffer).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: userEntityList[0].id },
      });
    });

    it('should not save an avatar for a user if it doesnt find the user', async () => {
      // Arrange
      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValueOnce(false);
      const file: Express.Multer.File = '' as any;

      // Assert
      await expect(
        usersService.saveAvatar(userEntityList[1].id, file),
      ).rejects.toEqual(new EntityNotExistError(User.name));
    });

    it('should throw an exception with uploadBuffer', async () => {
      // Arrange
      jest
        .spyOn(mockFilesUploadService, 'uploadBuffer')
        .mockRejectedValueOnce(new Error());
      const file: Express.Multer.File = '' as any;

      //Assert
      await expect(
        usersService.saveAvatar(userEntityList[1].id, file),
      ).rejects.toThrowError();
    });

    it('should throw an exception with update', async () => {
      // Arrange
      jest
        .spyOn(mockUsersRepository, 'update')
        .mockRejectedValueOnce(new Error());

      //Assert
      await expect(
        usersService.update({ id: '123' }, { avatar: '' }),
      ).rejects.toThrowError();
    });
  });

  describe('ChangePassword', () => {
    it('should change user password', async () => {
      // Act
      const result = await usersService.changePassword(changePasswordUserDto);

      // Assert
      expect(true).toEqual(
        await userEntityList[0].validatePassword(
          changePasswordUserDto.newPassword,
        ),
      );
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: userEntityList[0].id },
      });
      expect(mockUsersRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.update).toHaveBeenCalledWith(
        userEntityList[0].id,
        {
          password: result.password,
        },
      );
    });

    it('should not change user password if it doesnt find the user', async () => {
      // Arrange
      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValueOnce(false);

      // Assert
      await expect(
        usersService.changePassword(changePasswordUserDto),
      ).rejects.toEqual(new EntityNotExistError(User.name));
    });

    it('should not change user password if the new password does not match the saved password', async () => {
      // Arrange
      const user = new User({ name: 'test-2', password: 'test' });
      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValueOnce(user);

      // Assert
      await expect(
        usersService.changePassword(changePasswordUserDto),
      ).rejects.toEqual(
        new UnprocessableEntityError('Current password is not correct'),
      );
    });
  });

  describe('FindAll', () => {
    it('should find all users', async () => {
      // Arrange
      jest
        .spyOn(mockUsersRepository, 'findAndCount')
        .mockResolvedValue([userEntityList, userEntityList.length]);

      //act
      const result = await usersService.findAll({
        pagination: {
          take: 1,
          skip: 1,
        },
        where: { name: 'test-1' },
        order: {
          name: 'ASC',
        },
      });

      //Assert
      expect(result).toEqual(findAllResult);
      expect(mockUsersRepository.findAndCount).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // Arrange
      jest
        .spyOn(mockUsersRepository, 'findAndCount')
        .mockRejectedValueOnce(new Error());

      //Assert
      await expect(
        usersService.findAll({
          pagination: {
            take: 1,
            skip: 1,
          },
          where: { name: 'test-1' },
          order: {
            name: 'ASC',
          },
        }),
      ).rejects.toThrowError();
    });
  });

  describe('FindOne', () => {
    it('should find one user', async () => {
      //Act
      const result = await usersService.findOne({
        where: { name: 'test-1' },
      });

      //Assert
      expect(result).toEqual(userEntityList[0]);
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'test-1' },
      });
    });

    it('should throw an exception', async () => {
      // Arrange
      jest
        .spyOn(mockUsersRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      //Assert
      await expect(usersService.findOne({})).rejects.toThrowError();
    });
  });

  describe('FindById', () => {
    it('should find a user by id', async () => {
      //Act
      const result = await usersService.findById(userEntityList[0].id);

      //Assert
      expect(result).toEqual(userEntityList[0]);
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: userEntityList[0].id },
      });
    });

    it('should not find a user by id if it doesnt find the user', async () => {
      // Arrange
      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValueOnce(false);

      // Assert
      await expect(usersService.findById(userEntityList[0].id)).rejects.toEqual(
        new EntityNotExistError(User.name),
      );
    });

    it('should throw an exception', async () => {
      // Arrange
      jest
        .spyOn(mockUsersRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      //Assert
      await expect(
        usersService.findById(userEntityList[0].id),
      ).rejects.toThrowError();
    });
  });

  describe('Update', () => {
    it('should update a user', async () => {
      // Arrange
      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValueOnce(true);

      //Act
      const result = await usersService.update(
        { id: userEntityList[0].id },
        updateUserDto,
      );

      //Assert
      expect(result).toEqual(updatedUserEntity);
      expect(mockUsersRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: userEntityList[0].id },
      });
    });

    it('should not update a user if it doesnt find the user', async () => {
      // Arrange
      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValueOnce(false);

      // Assert
      await expect(
        usersService.update({ id: '123' }, updateUserDto),
      ).rejects.toEqual(new EntityNotExistError(User.name));
    });

    it('should throw an exception', async () => {
      // Arrange
      jest
        .spyOn(mockUsersRepository, 'update')
        .mockRejectedValueOnce(new Error());

      //Assert
      await expect(
        usersService.update({ id: '123' }, updateUserDto),
      ).rejects.toThrowError();
    });
  });

  describe('Remove', () => {
    it('should remove a user', async () => {
      // Arrange
      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValueOnce(true);

      //Act
      const result = await usersService.remove({ id: userEntityList[0].id });

      // Assert
      expect(result).toEqual(DeleteResult);
      expect(mockUsersRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.delete).toHaveBeenCalledWith(
        userEntityList[0].id,
      );
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: userEntityList[0].id },
      });
    });

    it('should not remove a user if it doesnt find the user', async () => {
      // Arrange
      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValueOnce(false);

      // Assert
      await expect(usersService.remove({ id: '123' })).rejects.toEqual(
        new EntityNotExistError(User.name),
      );
    });

    it('should throw an exception', async () => {
      // Arrange
      jest
        .spyOn(mockUsersRepository, 'delete')
        .mockRejectedValueOnce(new Error());

      //Assert
      await expect(usersService.remove({ id: '123' })).rejects.toThrowError();
    });
  });
});
