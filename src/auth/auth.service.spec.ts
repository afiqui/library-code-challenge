import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRefreshData } from './interfaces/auth.interface';
import { PrismaService } from '../services/prisma/prisma.service';
describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

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

  const mockAuthRefreshData: AuthRefreshData = {
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('encode', () => {
    it('should return a refresh token', () => {
      const refreshToken = authService.encode(mockAuthRefreshData);
      expect(refreshToken).toHaveProperty('refreshToken');
    });
  });

  describe('decode', () => {
    it('should decode a refresh token', () => {
      const refreshToken = authService.encode(mockAuthRefreshData);
      const decodedToken = authService.decode(refreshToken);
      expect(decodedToken).toHaveProperty('email');
    });
  });

  describe('updateToken', () => {
    it('should update the refresh token for a user', async () => {
      const user = { ...mockUser, refreshToken: 'oldRefreshToken' };
      const expectedUpdatedUser = { ...user, refreshToken: 'newRefreshToken' };
      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(expectedUpdatedUser);

      const result = await authService.updateToken({ email: user.email });

      expect(prismaService.user.update).toHaveBeenCalledWith({
        select: { refreshToken: true },
        data: { refreshToken: expect.any(String) },
        where: { email: user.email },
      });
      expect(result).toEqual(expectedUpdatedUser);
    });
  });

  describe('loginCallback', () => {
    it('should return a new refresh token for an existing user', async () => {
      const mockUser = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        picture: 'https://example.com/test-user.jpg',
      };
      const mockReq = {
        user: mockUser,
      };
      const mockUserFindFirstOrThrow = jest.fn().mockResolvedValue(mockUser);
      const mockUserUpdate = jest.fn().mockResolvedValue({
        refreshToken: 'new-refresh-token',
      });
      const prismaService = {
        user: {
          findFirstOrThrow: mockUserFindFirstOrThrow,
          update: mockUserUpdate,
        },
      };
      const authService = new AuthService(prismaService as any);

      const result = await authService.loginCallback(mockReq as any);

      expect(result).toEqual({ refreshToken: 'new-refresh-token' });
      expect(mockUserFindFirstOrThrow).toHaveBeenCalledWith({
        where: {
          email: mockUser.email,
        },
      });
      expect(mockUserUpdate).toHaveBeenCalledWith({
        data: {
          refreshToken: expect.any(String),
        },
        select: {
          refreshToken: true,
        },
        where: {
          email: mockUser.email,
        },
      });
    });

    it('should create a new user and return it with a new refresh token if the user does not exist', async () => {
      const mockUser = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        picture: 'https://example.com/test-user.jpg',
      };
      const mockReq = {
        user: mockUser,
      };
      const mockUserCreate = jest.fn().mockResolvedValue(mockUser);
      const mockUserFindFirstOrThrow = jest.fn().mockRejectedValue(new Error());
      const mockUserUpdate = jest.fn().mockResolvedValue({
        refreshToken: 'new-refresh-token',
      });
      const prismaService = {
        user: {
          create: mockUserCreate,
          findFirstOrThrow: mockUserFindFirstOrThrow,
          update: mockUserUpdate,
        },
      };
      const authService = new AuthService(prismaService as any);

      const result = await authService.loginCallback(mockReq as any);

      expect(result).toEqual({ refreshToken: 'new-refresh-token' });
      expect(mockUserFindFirstOrThrow).toHaveBeenCalledWith({
        where: {
          email: mockUser.email,
        },
      });
      expect(mockUserCreate).toHaveBeenCalledWith({
        data: mockUser,
      });
      expect(mockUserUpdate).toHaveBeenCalledWith({
        data: {
          refreshToken: expect.any(String),
        },
        select: {
          refreshToken: true,
        },
        where: {
          email: mockUser.email,
        },
      });
    });
  });
});
