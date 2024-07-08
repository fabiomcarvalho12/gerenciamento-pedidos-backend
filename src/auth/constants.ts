import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

ConfigModule.forRoot();

export const JWT_ACCESS_TOKEN_PARAMS = {
  privateKey: fs.readFileSync(
    path.resolve(__dirname, './keys/private-key.pem'),
    'utf8',
  ),
  publicKey: fs.readFileSync(
    path.resolve(__dirname, './keys/public-key.pem'),
    'utf8',
  ),
  options: {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '1d',
    algorithm: (process.env.JWT_ACCESS_TOKEN_ALGORITHM as Algorithm) ?? 'RS256',
  },
};

type Algorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'none';

export const IS_PUBLIC_KEY = 'isPublic';
