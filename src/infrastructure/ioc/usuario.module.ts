import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '@domain/model/usuario.entity';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { UsuarioRepositoryImpl } from '@infrastructure/repository/usuario/usuario-impl.repository';
import { BuscarUsuarioUseCase } from '@domain/service/usuario/use-cases/buscar-usuario/buscar-usuario.usecase';
import { UsuarioController } from '@api/controller/usuario/usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, IUsuarioRepository])],
  controllers: [UsuarioController],
  providers: [
    BuscarUsuarioUseCase,
    {
      provide: IUsuarioRepository,
      useClass: UsuarioRepositoryImpl,
    },
  ],
  exports: [],
})
export class UsuarioModule {}
