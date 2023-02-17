import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { ICreateRentalDto } from './dto/create-rental.dto';

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.rental.findMany({
      where: {
        deletedAt: {
          isSet: false,
        },
      },
    });
  }
  async createRental(createRentalDto: ICreateRentalDto) {
    const bookIsRented = await this.prisma.rental.findFirst({
      where: {
        bookId: createRentalDto.bookId,
        returnedAt: {
          isSet: false,
        },
      },
    });
    if (bookIsRented) {
      throw new HttpException(
        'Book is not available for rental',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.prisma.rental.create({
      data: createRentalDto,
    });
  }
  returnRental(id: string) {
    return this.prisma.rental.updateMany({
      where: {
        OR: [
          {
            id,
          },
          {
            bookId: id,
          },
        ],
        returnedAt: {
          isSet: false,
        },
      },
      data: {
        returnedAt: new Date(),
      },
    });
  }
}
