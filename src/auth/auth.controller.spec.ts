import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../services/prisma/prisma.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

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

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('googleLoginCallback', () => {
    it('should return the user with a new refresh token', async () => {
      const mockRefreshToken = { refreshToken: 'mockRefreshToken' };

      jest
        .spyOn(authService, 'googleLoginCallback')
        .mockResolvedValueOnce(mockRefreshToken);

      const result = await authController.googleLoginCallback({
        user: mockUser,
      });

      expect(result).toEqual(mockRefreshToken);
      expect(authService.googleLoginCallback).toHaveBeenCalledWith({
        user: mockUser,
      });
    });
  });

  describe('refresh', () => {
    it('should return the user with a new refresh token', async () => {
      const mockRefreshToken = { refreshToken: 'mockRefreshToken' };

      jest
        .spyOn(authService, 'refresh')
        .mockResolvedValueOnce(mockRefreshToken);

      const result = await authController.refresh(mockRefreshToken);

      expect(result).toEqual(mockRefreshToken);
      expect(authService.refresh).toHaveBeenCalledWith(mockRefreshToken);
    });
  });
});
