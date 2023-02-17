import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../services/prisma/prisma.service';

describe('SearchService', () => {
  let searchService: SearchService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: PrismaService,
          useValue: {
            book: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    searchService = module.get<SearchService>(SearchService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('searchBookByTitle', () => {
    it('should call prisma.book.findMany with correct arguments', async () => {
      const title = 'title';
      await searchService.searchBookByTitle(title);
      expect(prismaService.book.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            contains: title,
          },
          deletedAt: {
            isSet: false,
          },
        },
      });
    });
  });

  describe('searchBookByAuthor', () => {
    it('should call prisma.book.findMany with correct arguments', async () => {
      const author = 'author';
      await searchService.searchBookByAuthor(author);
      expect(prismaService.book.findMany).toHaveBeenCalledWith({
        where: {
          author: {
            contains: author,
          },
          deletedAt: {
            isSet: false,
          },
        },
      });
    });
  });
});
