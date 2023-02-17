import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import {
  AuthInterface,
  AuthRefreshToken,
  AuthRefreshData,
  AuthUserProperties,
  AuthUpdateToken,
} from './interfaces/auth.interface';
import { env } from '../utils/env';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class AuthService implements AuthInterface {
  constructor(private readonly prisma: PrismaService) {}

  encode(body: AuthRefreshData): AuthRefreshToken {
    const refreshToken = jwt.sign(body, env.REFRESH_TOKEN_SECRET, {
      expiresIn: '24h',
    }) as unknown as string;
    return { refreshToken };
  }

  decode(body: AuthRefreshToken): AuthRefreshData {
    return jwt.verify(
      body.refreshToken,
      env.REFRESH_TOKEN_SECRET,
    ) as unknown as AuthRefreshData;
  }

  updateToken({ email }: AuthUpdateToken): Promise<AuthRefreshToken> {
    const refresh_token = this.encode({ email });

    return this.prisma.user.update({
      select: {
        refreshToken: true,
      },
      data: {
        refreshToken: refresh_token.refreshToken,
      },
      where: {
        email,
      },
    });
  }

  async loginCallback(
    req: AuthUserProperties,
  ): Promise<Pick<User, 'refreshToken'>> {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          email: req?.user?.email,
        },
      });

      return this.updateToken(user);
    } catch (err) {
      const user = await this.prisma.user.create({
        data: {
          ...req?.user,
        },
      });

      return this.updateToken(user);
    }
  }

  async googleLoginCallback(
    req: AuthUserProperties,
  ): Promise<Pick<User, 'refreshToken'>> {
    return this.loginCallback(req);
  }

  async refresh(body: AuthRefreshToken): Promise<Pick<User, 'refreshToken'>> {
    try {
      const decode = this.decode(body);

      const user = await this.prisma.user.findFirst({
        where: {
          email: decode.email,
        },
      });

      if (!user || user.refreshToken !== body.refreshToken)
        throw new BadRequestException(
          'Não foi possivel validar o token de atualização.',
        );

      return this.updateToken(user);
    } catch (e) {
      throw new BadRequestException('Refresh token expirado');
    }
  }
}
