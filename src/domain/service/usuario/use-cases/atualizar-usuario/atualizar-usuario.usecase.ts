import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { Injectable, Logger } from '@nestjs/common';
import { AdicionarUsuarioResponseDTO } from '@api/model/usuario/response/adicionar-usuario.response';
import { UsuarioNotFoundException } from '@api/err/usuario-notfound.exception';
import { AtualizarUsuarioRequestDTO } from '@api/model/usuario/request/atualizar-usuario.request';
import { IEmpresaRepository } from '@domain/repository/empresa.repository';
import { EmpresaNotFoundException } from '@api/err/empresa-notfound.exception';
import { AtualizarUsuarioMapper } from '@infrastructure/repository/usuario/mapper/atualizar-usuario.mapper copy';

@Injectable()
export class AtualizarUsuarioUseCase {
  private readonly logger = new Logger(AtualizarUsuarioUseCase.name);

  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly empresaRepository: IEmpresaRepository,
    private readonly atualziarUsuarioMapper: AtualizarUsuarioMapper,
  ) {
    this.atualziarUsuarioMapper = new AtualizarUsuarioMapper();
  }

  async execute(
    usuarioId: number,
    usuario: AtualizarUsuarioRequestDTO,
  ): Promise<AdicionarUsuarioResponseDTO> {
    this.logger.debug(`Preparando o AtualizarUsuarioUseCase...`);

    const usuarioAtual = await this.usuarioRepository.findById(usuarioId, true);

    if (!usuarioAtual) {
      this.logger.error(
        `Usuário com id: ${usuarioId} não está ativo ou não existe, favor entrar em contato com administrador do sistema.`,
      );
      throw new UsuarioNotFoundException(
        `Usuário com id: ${usuarioId} não está ativo ou não existe, favor entrar em contato com administrador do sistema.`,
      );
    }

    const empresa = await this.empresaRepository.findById(usuario.empresaId);

    if (!empresa) {
      this.logger.error(
        `Empresa com id: ${usuario.empresaId} não está ativa ou não existe, favor entrar em contato com administrador do sistema.`,
      );
      throw new EmpresaNotFoundException(
        `Empresa com id: ${usuario.empresaId} não está ativa ou não existe, favor entrar em contato com administrador do sistema.`,
      );
    }

    const { ativo: ativoAtual, createdAt: createdAtAtual } = usuarioAtual;
    const user = await this.atualziarUsuarioMapper.mapFrom(usuario);

    const novoUsuario = await this.usuarioRepository.update(usuarioId, user);

    const {
      secretId: secretIdAtual,
      empresa: { id: empresaId },
      updatedAt,
    } = novoUsuario;

    return new AdicionarUsuarioResponseDTO(
      usuarioId,
      secretIdAtual,
      empresaId,
      ativoAtual,
      createdAtAtual,
      updatedAt,
    );
  }
}
