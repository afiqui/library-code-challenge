import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}
  searchBookByTitle(title: string) {
    return this.prisma.book.findMany({
      where: {
        title: {
          contains: title,
        },
        deletedAt: {
          isSet: false,
        },
      },
    });
  }

  searchBookByAuthor(author: string) {
    return this.prisma.book.findMany({
      where: {
        author: {
          contains: author,
        },
        deletedAt: {
          isSet: false,
        },
      },
    });
  }
}
