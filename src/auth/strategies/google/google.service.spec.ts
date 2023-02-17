import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthStrategy } from './google.service';
import { PrismaService } from '../../../services/prisma/prisma.service';

describe('GoogleAuthStrategy', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    provider: 'google',
    firstName: 'John',
    lastName: 'Doe',
    picture: 'https://example.com/image.jpg',
    refreshToken: '',
  };

  const prismaServiceMock = {
    user: {
      findOne: jest.fn((params) => {
        if (params.where.email === mockUser.email) {
          return mockUser;
        }
        return null;
      }),
      create: jest.fn((params) => ({
        ...mockUser,
        ...params.data,
      })),
    },
  };

  let googleAuthStrategy: GoogleAuthStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleAuthStrategy,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    googleAuthStrategy = module.get<GoogleAuthStrategy>(GoogleAuthStrategy);
  });

  describe('validate', () => {
    it('should return a user object if the user exists in the database', async () => {
      const doneMock = jest.fn();
      await googleAuthStrategy.validate(
        'access_token',
        'refresh_token',
        {
          name: { givenName: 'John', familyName: 'Doe' },
          emails: [{ value: 'test@example.com' }],
          photos: [{ value: 'https://example.com/image.jpg' }],
        },
        doneMock,
      );
      const { id, ...user } = { ...mockUser };
      expect(doneMock).toHaveBeenCalledWith(null, user);
    });
  });
});
