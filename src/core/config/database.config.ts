import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function typeormModuleOptions(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: process.env.ENV === 'development' ? true : false,
    entities: [],
    synchronize: process.env.ENV === 'development',
    autoLoadEntities: process.env.ENV === 'development' ? true : false,
    retryAttempts: 10,
  };
}

export default registerAs('database', () => ({
  config: typeormModuleOptions(),
}));
