import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { CreateRentalDto, ICreateRentalDto } from './dto/create-rental.dto';
import { ReturnRentalDto } from './dto/return-rental.dto';

@Controller('rentals')
@UseGuards(AuthenticationGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  getAllRentals() {
    return this.rentalsService.findAll();
  }

  @Post()
  createRental(@Body() createRentalDto: ICreateRentalDto) {
    CreateRentalDto.parse(createRentalDto);
    return this.rentalsService.createRental(createRentalDto);
  }

  @Post('return/:id')
  returnRental(@Param('id') id: string) {
    ReturnRentalDto.parse({ id });
    return this.rentalsService.returnRental(id);
  }
}
