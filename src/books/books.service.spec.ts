import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../services/prisma/prisma.service';
import { BooksService } from './books.service';
import { ICreateBookDto } from './dto/create-book.dto';
import { IUpdateBookDto } from './dto/update-book.dto';
import { Book } from '@prisma/client';

describe('BooksService', () => {
  let booksService: BooksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: {
            book: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    booksService = moduleRef.get<BooksService>(BooksService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: ICreateBookDto = {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
      };

      const expectedBook: Book = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...createBookDto,
      };

      jest.spyOn(prismaService.book, 'create').mockResolvedValue(expectedBook);

      const result = await booksService.create(createBookDto);

      expect(prismaService.book.create).toHaveBeenCalledWith({
        data: createBookDto,
      });
      expect(result).toEqual(expectedBook);
    });
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      const expectedBooks: Book[] = [
        {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: '2',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      jest
        .spyOn(prismaService.book, 'findMany')
        .mockResolvedValue(expectedBooks);

      const result = await booksService.findAll();

      expect(prismaService.book.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: {
            isSet: false,
          },
        },
      });
      expect(result).toEqual(expectedBooks);
    });
  });

  describe('findOne', () => {
    it('should return the book with the given id', async () => {
      const expectedBook = {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(prismaService.book, 'findFirst')
        .mockResolvedValue(expectedBook);

      const result = await booksService.findOne('1');

      expect(prismaService.book.findFirst).toHaveBeenCalledWith({
        where: {
          id: '1',
          deletedAt: {
            isSet: false,
          },
        },
      });
      expect(result).toEqual(expectedBook);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: IUpdateBookDto = {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
      };

      const expectedBook: Book = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...updateBookDto,
      };

      jest.spyOn(prismaService.book, 'update').mockResolvedValue(expectedBook);

      const result = await booksService.update('1', updateBookDto);

      expect(result.title).toBe(updateBookDto.title);
      expect(result.author).toBe(updateBookDto.author);
    });

    it('should throw an error if book does not exist', async () => {
      const updatedBookData: IUpdateBookDto = {
        title: 'Updated book title',
        author: 'Updated book author',
      };

      const fakeId = 'fakeId';

      jest.spyOn(prismaService.book, 'update').mockRejectedValue(new Error());

      try {
        await booksService.update(fakeId, updatedBookData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
