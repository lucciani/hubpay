import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { Injectable, Logger } from '@nestjs/common';
import { AdicionarUsuarioResponseDTO } from '@api/model/usuario/response/adicionar-usuario.response';
import { AdicionarUsuarioRequestDTO } from '@api/model/usuario/request/adicionar-usuario.request';
import { AdicionarUsuarioMapper } from '@infrastructure/repository/usuario/mapper/adicionar-usuario.mapper';
import { UsuarioNotFoundException } from '@api/err/usuario-notfound.exception';
import { IEmpresaRepository } from '@domain/repository/empresa.repository';
import { EmpresaNotFoundException } from '@api/err/empresa-notfound.exception';

@Injectable()
export class AdicionarUsuarioUseCase {
  private readonly logger = new Logger(AdicionarUsuarioUseCase.name);

  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly adicionarUsuarioMapper: AdicionarUsuarioMapper,
    private readonly empresaRepository: IEmpresaRepository,
  ) {
    this.adicionarUsuarioMapper = new AdicionarUsuarioMapper();
  }

  async execute(
    usuario: AdicionarUsuarioRequestDTO,
  ): Promise<AdicionarUsuarioResponseDTO> {
    this.logger.debug(`Preparando o AdicionarUsuarioUseCase...`);

    const { secretId } = usuario;
    const usuarioAtual = await this.usuarioRepository.findBySecretId(secretId);

    if (usuarioAtual) {
      this.logger.error(
        `Usuário com secretId: ${usuario.secretId} não está ativo ou já existe, favor entrar em contato com administrador do sistema.`,
      );
      throw new UsuarioNotFoundException(
        `Usuário com secretId: ${usuario.secretId} não está ativo ou já existe, favor entrar em contato com administrador do sistema.`,
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

    const user = await this.adicionarUsuarioMapper.mapFrom(usuario);

    const novaoUsuario = await this.usuarioRepository.create(user);

    const {
      id,
      secretId: secretIdAtual,
      ativo,
      empresa: { id: empresaId },
      createdAt,
      updatedAt,
    } = novaoUsuario;

    return new AdicionarUsuarioResponseDTO(
      id,
      secretIdAtual,
      empresaId,
      ativo,
      createdAt,
      updatedAt,
    );
  }
}
