import { EmpresaEntity } from '@domain/model/empresa.entity';
import { IEmpresaRepository } from '@domain/repository/empresa.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

Injectable();
export class EmpresaRepositoryImpl implements IEmpresaRepository {
  private readonly logger = new Logger(EmpresaRepositoryImpl.name);

  constructor(
    @InjectRepository(EmpresaEntity)
    private empresaRepository: Repository<EmpresaEntity>,
  ) {}

  async findById(empresaId: number): Promise<EmpresaEntity> {
    this.logger.debug(`Buscando empresa com id: ${empresaId} `);
    return this.empresaRepository.findOneBy({ id: empresaId });
  }
}
