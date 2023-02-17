import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ICreateBookDto } from './dto/create-book.dto';
import { IUpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from '../services/prisma/prisma.service';
import { Book } from '@prisma/client';
import { ZodError } from 'zod';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const bookData: ICreateBookDto = {
    title: 'Book Title',
    author: 'Book Author',
  };

  const updatedBookData: IUpdateBookDto = {
    title: 'Updated Book Title',
    author: 'Updated Book Author',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [BooksService, PrismaService],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  describe('create', () => {
    it('should create a book', async () => {
      const book: Book = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...bookData,
      };
      jest.spyOn(service, 'create').mockResolvedValueOnce(book);

      const result = await controller.create(bookData);

      expect(result).toEqual(book);
    });

    it('should throw an error if createBookDto is invalid', async () => {
      const invalidBookData: ICreateBookDto = {
        title: '',
        author: '',
      };
      try {
        controller.create(invalidBookData);
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const book: Book = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...bookData,
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([book, book]);

      const result = await controller.findAll();

      expect(result).toEqual([book, book]);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const book: Book = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...bookData,
      };
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(book);

      const result = await controller.findOne('1');

      expect(result).toEqual(book);
    });
  });

  describe('update', () => {
    it('should update a book by id', async () => {
      const book: Book = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...bookData,
      };
      jest.spyOn(service, 'update').mockResolvedValueOnce(book);

      const result = await controller.update('1', updatedBookData);

      expect(result).toEqual(book);
    });

    it('should throw an error if updateBookDto is invalid', async () => {
      const invalidUpdatedBookData: IUpdateBookDto = {
        title: '',
        author: '',
      };
      try {
        controller.update('1', invalidUpdatedBookData);
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
      }
    });
  });

  describe('remove', () => {
    it('should remove a book by id', async () => {
      const book: Book = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...bookData,
      };
      jest.spyOn(service, 'remove').mockResolvedValueOnce(book);

      const result = await controller.remove('1');

      expect(result).toEqual(book);
    });
  });
});
