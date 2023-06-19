import { EmpresaEntity } from '@domain/model/empresa.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IEmpresaRepository {
  abstract findById(empresaId: number): Promise<EmpresaEntity>;
}
