import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from 'app.service';
import { AppController } from './app.controller';
import { setEnvironment } from '@core/config/enviroments';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '@infrastructure/db/database.config';
import { typeOrmAsyncConfig } from '@infrastructure/db/typeorm-config';
import { UsuarioModule } from '@infrastructure/ioc/usuario.module';
import { AuthModule } from '@infrastructure/ioc/auth.module';
import { EmpresaModule } from '@infrastructure/ioc/empresa.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      expandVariables: true,
      envFilePath: setEnvironment(),
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UsuarioModule,
    EmpresaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
