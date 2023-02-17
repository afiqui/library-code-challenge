import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { SearchByTitleDto } from './dto/search-by-title.dto';
import { SearchByAuthorDto } from './dto/search-by-author.dto';

@Controller('search')
@UseGuards(AuthenticationGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get('title/:title')
  searchBookByTitle(@Param('title') title: string) {
    SearchByTitleDto.parse({ title });
    return this.searchService.searchBookByTitle(title);
  }
  @Get('author/:author')
  searchBookByAuthor(@Param('author') author: string) {
    SearchByAuthorDto.parse({ author });
    return this.searchService.searchBookByAuthor(author);
  }
}
