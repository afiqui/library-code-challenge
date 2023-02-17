import { User } from '@prisma/client';

export type AuthUserProperties = {
  user: User;
};

export type AuthRefreshToken = Pick<User, 'refreshToken'>;

export type AuthRefreshData = Pick<User, 'email'>;

export type AuthUpdateToken = Pick<User, 'email'>;

export interface AuthInterface {
  loginCallback?(req: AuthUserProperties): Promise<AuthRefreshToken>;

  googleLogin?(): void;
  googleLoginCallback(req: AuthUserProperties): Promise<AuthRefreshToken>;

  encode?(body: AuthRefreshData): AuthRefreshToken;
  decode?(body: AuthRefreshToken): AuthRefreshData;

  updateToken?(body: AuthUpdateToken): Promise<AuthRefreshToken>;

  refresh(body: AuthRefreshToken): Promise<AuthRefreshToken>;
}
