import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaEntity } from '@domain/model/empresa.entity';
import { IEmpresaRepository } from '@domain/repository/empresa.repository';
import { EmpresaController } from '@api/controller/empresa/empresa.controller';
import { BuscarEmpresaUseCase } from '@domain/service/empresa/buscar-empresa/buscar-empresa.usecase';
import { EmpresaRepositoryImpl } from '@infrastructure/repository/empresa/empresa-impl.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaEntity, IEmpresaRepository])],
  controllers: [EmpresaController],
  providers: [
    BuscarEmpresaUseCase,
    {
      provide: IEmpresaRepository,
      useClass: EmpresaRepositoryImpl,
    },
  ],
  exports: [],
})
export class EmpresaModule {}
