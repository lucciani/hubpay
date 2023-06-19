import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IEmpresaRepository } from '@domain/repository/empresa.repository';
import { BuscarEmpresaResponseDTO } from '@api/model/empresa/response/buscar-empresa.response';

@Injectable()
export class BuscarEmpresaUseCase {
  private readonly logger = new Logger(BuscarEmpresaUseCase.name);

  constructor(private readonly empresaRepository: IEmpresaRepository) {}

  async execute(empresaId: number): Promise<BuscarEmpresaResponseDTO> {
    this.logger.debug(`Preparando o BuscarEmpresaUseCase...`);
    const empresa = await this.empresaRepository.findById(empresaId);

    if (!empresa) {
      throw new NotFoundException(
        `Empresa com id: ${empresaId} não está ativa ou não existe, favor entrar em contato com administrador do sistema.`,
      );
    }

    return new BuscarEmpresaResponseDTO(
      empresa.id,
      empresa.nome,
      empresa.secretKey,
      empresa.ativo,
    );
  }
}
