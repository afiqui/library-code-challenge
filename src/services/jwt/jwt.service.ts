import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtServiceStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: String(process.env.REFRESH_TOKEN_SECRET),
    });
  }

  async validate(payload: { email: string }) {
    if (payload?.email) {
      const getUser = await this.prisma.user.findUnique({
        select: {
          id: true,
        },
        where: {
          email: payload.email,
        },
      });

      if (getUser) return getUser as any;
    }

    throw new UnauthorizedException('Unauthorized');
  }

  sign(payload: string | object | Buffer, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  async signAsync(payload: string | object | Buffer, options?: JwtSignOptions) {
    return this.jwtService.signAsync(payload, options);
  }

  decode(token: string, options?: any) {
    return this.jwtService.decode(token, options);
  }

  verify(token: string, options?: JwtVerifyOptions) {
    return this.jwtService.verify(token, options);
  }

  async verifyAsync(token: string, options?: JwtVerifyOptions) {
    return this.jwtService.verifyAsync(token, options);
  }
}
