import { Injectable } from '@nestjs/common';
import { IUpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from '../services/prisma/prisma.service';
import { ICreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}
  create(createBookDto: ICreateBookDto) {
    return this.prisma.book.create({
      data: createBookDto,
    });
  }

  findAll() {
    return this.prisma.book.findMany({
      where: {
        deletedAt: {
          isSet: false,
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.book.findFirst({
      where: {
        id,
        deletedAt: {
          isSet: false,
        },
      },
    });
  }

  update(id: string, updateBookDto: IUpdateBookDto) {
    return this.prisma.book.update({
      where: {
        id,
      },
      data: updateBookDto,
    });
  }

  remove(id: string) {
    return this.prisma.book.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
