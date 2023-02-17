import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../services/prisma/prisma.service';
import { ICreateRentalDto } from './dto/create-rental.dto';
import { RentalsService } from './rentals.service';

describe('RentalsService', () => {
  let service: RentalsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalsService, PrismaService],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return all rentals that have not been deleted', async () => {
      const date = new Date();
      const rentalData = [
        {
          id: '1',
          createdAt: date,
          rentedAt: date,
          returnedAt: date,
          updatedAt: date,
          deletedAt: null,
          dueDate: date,
          bookId: '63eebb80bc17963493a96f0b',
          userId: '63ee90ff93860bb6b36992c6',
        },
      ];
      jest
        .spyOn(prismaService.rental, 'findMany')
        .mockResolvedValue(rentalData);

      const result = await service.findAll();

      expect(prismaService.rental.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(rentalData.filter((r) => !r.deletedAt));
    });
  });

  describe('createRental', () => {
    it('should create a new rental and return it', async () => {
      const date = new Date();
      const createRentalDto: ICreateRentalDto = {
        userId: '63ee90ff93860bb6b36992c6',
        bookId: '63eebb80bc17963493a96f0b',
        dueDate: '2024-02-17T15:30:06.084Z',
      };
      const rentalData = {
        id: '1',
        createdAt: date,
        rentedAt: date,
        returnedAt: date,
        updatedAt: date,
        deletedAt: null,
        dueDate: date,
        bookId: createRentalDto.bookId,
        userId: createRentalDto.userId,
      };
      jest.spyOn(prismaService.rental, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.rental, 'create').mockResolvedValue(rentalData);

      const result = await service.createRental(createRentalDto);

      expect(prismaService.rental.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaService.rental.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(rentalData);
    });

    it('should throw an HttpException if the book is already rented', async () => {
      const date = new Date();
      const createRentalDto: ICreateRentalDto = {
        userId: '63ee90ff93860bb6b36992c6',
        bookId: '63eebb80bc17963493a96f0b',
        dueDate: '2024-02-17T15:30:06.084Z',
      };
      const rentedRental = {
        id: '1',
        createdAt: date,
        rentedAt: date,
        returnedAt: date,
        updatedAt: date,
        deletedAt: null,
        dueDate: date,
        bookId: createRentalDto.bookId,
        userId: createRentalDto.userId,
      };
      jest
        .spyOn(prismaService.rental, 'findFirst')
        .mockResolvedValue(rentedRental);

      await expect(service.createRental(createRentalDto)).rejects.toThrow(
        new HttpException(
          'Book is not available for rental',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});
