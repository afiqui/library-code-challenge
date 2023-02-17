import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { ICreateRentalDto } from './dto/create-rental.dto';
import { IReturnRentalDto } from './dto/return-rental.dto';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { Rental } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';

describe('RentalsController', () => {
  let controller: RentalsController;
  let rentalsService: RentalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [RentalsService, PrismaService],
    })
      .overrideGuard(AuthenticationGuard)
      .useValue({ canActivate: () => true }) // mock authentication guard
      .compile();

    controller = module.get<RentalsController>(RentalsController);
    rentalsService = module.get<RentalsService>(RentalsService);
  });

  describe('getAllRentals', () => {
    it('should return an array of rentals', async () => {
      const date = new Date();
      const rentals: Rental[] = [
        {
          id: '63ef9f258715b05979bd7fa0',
          userId: '63ee90ff93860bb6b36992c6',
          bookId: '63eebb80bc17963493a96f0b',
          rentedAt: date,
          dueDate: date,
          returnedAt: date,
          createdAt: date,
          updatedAt: date,
          deletedAt: null,
        },
      ];
      jest.spyOn(rentalsService, 'findAll').mockResolvedValue(rentals);

      expect(await controller.getAllRentals()).toBe(rentals);
    });
  });

  describe('createRental', () => {
    it('should create a rental and return it', async () => {
      const date = new Date();
      const createRentalDto: ICreateRentalDto = {
        userId: '63ee90ff93860bb6b36992c6',
        bookId: '63eebb80bc17963493a96f0b',
        dueDate: '2024-02-17T15:30:06.084Z',
      };
      const rental = {
        id: '63ef9f258715b05979bd7fa0',
        userId: '63ee90ff93860bb6b36992c6',
        bookId: '63eebb80bc17963493a96f0b',
        rentedAt: date,
        dueDate: date,
        returnedAt: date,
        createdAt: date,
        updatedAt: date,
        deletedAt: null,
      };
      jest.spyOn(rentalsService, 'createRental').mockResolvedValue(rental);

      expect(await controller.createRental(createRentalDto)).toBe(rental);
      expect(rentalsService.createRental).toHaveBeenCalledWith(createRentalDto);
    });
  });

  describe('returnRental', () => {
    it('should return a rental and return it', async () => {
      const rentalId = '1';
      const returnRentalDto: IReturnRentalDto = { id: rentalId };
      const rental = { count: 1 };
      jest.spyOn(rentalsService, 'returnRental').mockResolvedValue(rental);

      expect(await controller.returnRental(returnRentalDto.id)).toBe(rental);
      expect(rentalsService.returnRental).toHaveBeenCalledWith(rentalId);
    });
  });
});
