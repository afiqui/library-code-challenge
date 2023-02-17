import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { JwtStrategyModule } from './services/jwt/jwt.module';
import { SearchModule } from './search/search.module';
import { RentalsModule } from './rentals/rentals.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule.register(),
    JwtStrategyModule.register(),
    AuthModule,
    BooksModule,
    SearchModule,
    RentalsModule,
    UsersModule,
  ],
})
export class AppModule {}
