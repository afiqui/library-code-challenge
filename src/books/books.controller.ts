import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { IUpdateBookDto, UpdateBookDto } from './dto/update-book.dto';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { CreateBookDto, ICreateBookDto } from './dto/create-book.dto';

@Controller('books')
@UseGuards(AuthenticationGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: ICreateBookDto) {
    CreateBookDto.parse(createBookDto);
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: IUpdateBookDto) {
    UpdateBookDto.parse(updateBookDto);
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
