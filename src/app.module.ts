import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from 'app.service';
import { AppController } from './app.controller';
import { setEnvironment } from './core/config/enviroments';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TYPEORM_CONFIG } from '@core/config/constants';
import databaseConfig from '@core/config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>(TYPEORM_CONFIG),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      expandVariables: true,
      envFilePath: setEnvironment(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
