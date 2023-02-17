import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PrismaService } from '../services/prisma/prisma.service';

describe('SearchController', () => {
  const mockedBaseBook = {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  let controller: SearchController;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [SearchService, PrismaService],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  describe('searchBookByTitle', () => {
    it('should return books with a matching title', async () => {
      const searchSpy = jest
        .spyOn(service, 'searchBookByTitle')
        .mockResolvedValueOnce([
          { title: 'Book 1', author: 'Author 1', ...mockedBaseBook },
          { title: 'Book 2', author: 'Author 1', ...mockedBaseBook },
        ]);

      const result = await controller.searchBookByTitle('Book');

      expect(searchSpy).toHaveBeenCalledWith('Book');
      expect(result).toEqual([
        { title: 'Book 1', author: 'Author 1', ...mockedBaseBook },
        { title: 'Book 2', author: 'Author 1', ...mockedBaseBook },
      ]);
    });
  });

  describe('searchBookByAuthor', () => {
    it('should return books by a matching author', async () => {
      const searchSpy = jest
        .spyOn(service, 'searchBookByAuthor')
        .mockResolvedValueOnce([
          { title: 'Book 1', author: 'Author 1', ...mockedBaseBook },
          { title: 'Book 2', author: 'Author 1', ...mockedBaseBook },
        ]);

      const result = await controller.searchBookByAuthor('Author');

      expect(searchSpy).toHaveBeenCalledWith('Author');
      expect(result).toEqual([
        { title: 'Book 1', author: 'Author 1', ...mockedBaseBook },
        { title: 'Book 2', author: 'Author 1', ...mockedBaseBook },
      ]);
    });
  });
});
