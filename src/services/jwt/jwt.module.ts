import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtServiceStrategy } from './jwt.service';

@Module({})
export class JwtStrategyModule {
  static register(): DynamicModule {
    return {
      module: JwtStrategyModule,
      imports: [
        JwtModule.register({
          secret: String(process.env.JWT_SECRET_KEY),
        }),
      ],
      providers: [JwtServiceStrategy],
      exports: [JwtServiceStrategy],
      global: true,
    };
  }
}
