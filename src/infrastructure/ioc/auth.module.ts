import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { UsuarioRepositoryImpl } from '@infrastructure/repository/usuario/usuario-impl.repository';
import { AuthenticateUsuarioUseCase } from '@domain/service/usuario/use-cases/authenticate/authenticate.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '@domain/model/usuario.entity';
import { ExistUsuarioUseCase } from '@domain/service/usuario/use-cases/exist-usuario/exist-usuario.usecase';
import { JwtController } from '@api/controller/auth/jwt.controller';
import { jwtModuleConfig } from '@core/middlewares/auth/config/jwt-module.config';
import { AuthService } from '@domain/service/auth/auth.service';
import { JwtAuthStrategy } from '@core/middlewares/auth/strategies/jwt.strategy';
import { RefreshTokenStrategy } from '@core/middlewares/auth/strategies/refresh-token.strategy';

@Module({
  controllers: [JwtController],
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtModuleConfig),
    TypeOrmModule.forFeature([UsuarioEntity]),
  ],
  providers: [
    AuthService,
    AuthenticateUsuarioUseCase,
    JwtAuthStrategy,
    RefreshTokenStrategy,
    ExistUsuarioUseCase,
    {
      provide: IUsuarioRepository,
      useClass: UsuarioRepositoryImpl,
    },
  ],
})
export class AuthModule {}
