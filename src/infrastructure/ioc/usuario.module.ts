import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '@domain/model/usuario.entity';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { UsuarioRepositoryImpl } from '@infrastructure/repository/usuario/usuario-impl.repository';
import { BuscarUsuarioUseCase } from '@domain/service/usuario/use-cases/buscar-usuario/buscar-usuario.usecase';
import { UsuarioController } from '@api/controller/usuario/usuario.controller';
import { ListarUsuarioUseCase } from '@domain/service/usuario/use-cases/listar-usuarios/listar-usuario.usecase';
import { AdicionarUsuarioUseCase } from '@domain/service/usuario/use-cases/adicionar-usuario/adicionar-usuario.usecase';
import { AdicionarUsuarioMapper } from '@infrastructure/repository/usuario/mapper/adicionar-usuario.mapper';
import { IEmpresaRepository } from '@domain/repository/empresa.repository';
import { EmpresaRepositoryImpl } from '@infrastructure/repository/empresa/empresa-impl.repository';
import { EmpresaEntity } from '@domain/model/empresa.entity';
import { AtualizarUsuarioUseCase } from '@domain/service/usuario/use-cases/atualizar-usuario/atualizar-usuario.usecase';
import { AtualizarUsuarioMapper } from '@infrastructure/repository/usuario/mapper/atualizar-usuario.mapper copy';
import { AtivarUsuarioUseCase } from '@domain/service/usuario/use-cases/ativar-usuario/ativar-usuario.usecase';
import { InativarUsuarioUseCase } from '@domain/service/usuario/use-cases/inativar-usuario/inativar-usuario.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioEntity,
      IUsuarioRepository,
      IEmpresaRepository,
      EmpresaEntity,
    ]),
  ],
  controllers: [UsuarioController],
  providers: [
    BuscarUsuarioUseCase,
    ListarUsuarioUseCase,
    AdicionarUsuarioUseCase,
    AdicionarUsuarioMapper,
    AtualizarUsuarioUseCase,
    AtualizarUsuarioMapper,
    AtivarUsuarioUseCase,
    InativarUsuarioUseCase,
    {
      provide: IUsuarioRepository,
      useClass: UsuarioRepositoryImpl,
    },
    {
      provide: IEmpresaRepository,
      useClass: EmpresaRepositoryImpl,
    },
  ],
  exports: [],
})
export class UsuarioModule {}
