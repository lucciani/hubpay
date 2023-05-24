import * as dotenv from 'dotenv';

dotenv.config();

export function setEnvironment() {
  switch (process.env.NODE_ENV?.trim().toLowerCase()) {
    case 'test':
      return '.env.test';
    case 'stage':
      return '.env.stage';
    case 'development':
      return '.env.development';
    case 'production':
      return '.env.production';
    default:
      return '.env';
  }
}

export function getSentryEnvironment() {
  switch (process.env.NODE_ENV) {
    case 'stage':
      return 'stage';
    case 'test':
      return 'test';
    case 'production':
      return 'production';
    case 'development':
    default:
      return 'dev';
  }
}

export function getEnviroments(): any {
  return process.env;
}
