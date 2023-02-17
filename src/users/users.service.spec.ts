import { Test } from '@nestjs/testing';
import { PrismaService } from '../services/prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const mockUser = {
    email: 'test@example.com',
    id: '1',
    provider: 'google',
    firstName: 'Test',
    lastName: 'User',
    picture: 'https://example.com/test-user.jpg',
    refreshToken: 'mockRefreshToken',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { ...mockUser, id: '1', email: 'john@example.com', provider: 'google' },
        {
          ...mockUser,
          id: '2',
          email: 'jane@example.com',
          provider: 'facebook',
        },
      ];

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const result = await usersService.findAll();

      expect(result).toEqual(users);
      expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
