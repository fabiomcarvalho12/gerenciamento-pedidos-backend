/*import { DeleteResult } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { QueryStringUserDto } from './dto/query-string-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { orderByEnum } from '@common/bases/base-query-string.dto';
import { EntityNotExistError } from '@common/errors/entity-not-exist.error';
import { UpdateUserDto } from './dto/update-user.dto';


describe('UsersController', () => {
  let controller: UsersController;

  const createUserDto: CreateUserDto = {
    name: 'new user',
    email: 'test@gmail.com',
    password: '123',
    document: '12124455555',

  };

  const queryStringUserDto: QueryStringUserDto = {
    name: 'test',
    email: ' test',
    skip: 1,
    take: 10,
    orderBy: orderByEnum.DESC,
    sortBy: 'name',
  };

  const updateUserDto: UpdateUserDto = {
    name: 'test-1',
    email: 'testUpdate@gmail.com',
  };

  const newUser = new User(createUserDto);

  const updatedUserEntity = new User(updateUserDto);

  const userEntityList: User[] = [
    new User({ name: 'test-1' }),
    new User({ name: 'test-2' }),
    new User({ name: 'test-3' }),
  ];

  const { take, skip, orderBy, sortBy, ...where } = queryStringUserDto;
  const queryStringResult = {
    pagination: {
      take,
      skip,
    },
    where,
    order: {
      [sortBy]: orderBy.toUpperCase(),
    },
  };

  const mockUsersService = {
    create: jest.fn().mockResolvedValue(newUser),
    saveAvatar: jest.fn(),
    findAll: jest.fn().mockResolvedValue(userEntityList),
    findById: jest.fn().mockResolvedValue(userEntityList[0]),
    update: jest.fn().mockResolvedValue(updatedUserEntity),
    changePassword: jest.fn().mockResolvedValue(updatedUserEntity.password),
    remove: jest.fn().mockResolvedValue(DeleteResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create', () => {
    it('should create a user', async () => {
      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(result).toEqual(newUser);
      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('GetFilters', () => {
    it('should get users filters', async () => {
      // Act
      const result = await controller.getFilters(queryStringUserDto);

      // Assert
      expect(result).toEqual(queryStringResult);
    });
  });

  describe('FindAll', () => {
    it('should find all users', async () => {
      // Arrange
      jest.spyOn(controller, 'getFilters').mockImplementationOnce(() => {
        return queryStringResult;
      });

      // Act
      const result = await controller.findAll(queryStringUserDto);

      // Assert
      expect(result).toEqual(userEntityList);
      expect(controller.getFilters).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(queryStringResult);
    });
  });

  describe('FindById', () => {
    it('should find a user by id', async () => {
      // Act
      const result = await controller.findById(userEntityList[0].id);

      // Assert
      expect(result).toEqual(userEntityList[0]);
      expect(mockUsersService.findById).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findById).toHaveBeenCalledWith(
        userEntityList[0].id,
      );
    });

    it('should not find a user by id if it doesnt find the user', async () => {
      // Arrange
      jest
        .spyOn(mockUsersService, 'findById')
        .mockRejectedValueOnce(new EntityNotExistError(User.name));

      // Assert
      await expect(controller.findById('123')).rejects.toEqual(
        new EntityNotExistError(User.name),
      );
      expect(mockUsersService.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update', () => {
    it('should update a user', async () => {
      // Act
      const result = await controller.update(
        updateUserDto,
        userEntityList[0].id,
      );

      // Assert
      expect(result).toEqual(updatedUserEntity);
      expect(mockUsersService.update).toHaveBeenCalledTimes(1);
    });

    it('should not update a user if it doesnt find the user', async () => {
      // Arrange
      jest
        .spyOn(mockUsersService, 'update')
        .mockRejectedValueOnce(new EntityNotExistError(User.name));

      // Assert
      await expect(
        controller.update(updateUserDto, userEntityList[0].id),
      ).rejects.toEqual(new EntityNotExistError(User.name));
      expect(mockUsersService.update).toHaveBeenCalledTimes(1);
    });
  });

  
  });

  describe('Remove', () => {
    it('should remove a user', async () => {
      // Act
      const result = await controller.remove(userEntityList[0].id);

      // Assert
      expect(result).toEqual(DeleteResult);
      expect(mockUsersService.remove).toHaveBeenCalledTimes(1);
      expect(mockUsersService.remove).toHaveBeenCalledWith({
        id: userEntityList[0].id,
      });
    });

    it('should not remove a user if it doesnt find the user', async () => {
      // Arrange
      jest
        .spyOn(mockUsersService, 'remove')
        .mockRejectedValueOnce(new EntityNotExistError(User.name));

      // Assert
      await expect(controller.remove(userEntityList[0].id)).rejects.toEqual(
        new EntityNotExistError(User.name),
      );
      expect(mockUsersService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
*/