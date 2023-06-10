import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { setEnvironment } from '../../core/config/enviroments';

const configService = new ConfigService();

dotenv.config({
  path: setEnvironment(),
});

const dataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: Number(configService.get('DB_PORT')) || 3306,
  database: configService.get('DB_NAME'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  logging: configService.get('NODE_ENV') === 'development',
  migrations: [`${__dirname}/migrations/**/*.ts`],
});

export default dataSource;
