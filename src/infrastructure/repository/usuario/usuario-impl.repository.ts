import { UsuarioEntity } from '@domain/model/usuario.entity';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

Injectable();
export class UsuarioRepositoryImpl implements IUsuarioRepository {
  private readonly logger = new Logger(UsuarioRepositoryImpl.name);

  constructor(
    @InjectRepository(UsuarioEntity)
    private usersRepository: Repository<UsuarioEntity>,
  ) {}

  async update(
    usuarioId: number,
    usuario: UsuarioEntity,
  ): Promise<UsuarioEntity> {
    this.logger.debug(`Atualizando usuário com id: ${usuarioId} `);
    await this.usersRepository.update(usuarioId, usuario);
    const entidadeAtualizada = await this.findById(usuarioId);

    return entidadeAtualizada;
  }

  async create(usuario: UsuarioEntity): Promise<UsuarioEntity> {
    this.logger.debug(`Criando usuário com secret id: ${usuario.secretId} `);
    const userAtual = this.usersRepository.create(usuario);
    return this.usersRepository.save(userAtual);
  }

  async find(): Promise<UsuarioEntity[]> {
    this.logger.debug(`Buscando os usuários.`);
    return await this.usersRepository.findBy({ ativo: true });
  }

  async findBySecretId(secretId: string): Promise<UsuarioEntity> {
    this.logger.debug(`Buscando Secret id: ${secretId} `);
    return this.usersRepository.findOneBy({ secretId });
  }

  async aunthenticUsuario(secretId: string): Promise<UsuarioEntity> {
    this.logger.debug(`Buscando usuário ativo de secret id: ${secretId} `);
    return await this.usersRepository.findOneBy({ secretId, ativo: true });
  }

  async findById(usuarioId: number, full?: boolean): Promise<UsuarioEntity> {
    this.logger.debug(`Buscando usuário ativo ou full de id: ${usuarioId} `);
    let params = {};
    if (!full) {
      params = {
        id: usuarioId,
      };
    } else {
      params = {
        id: usuarioId,
        ativo: true,
      };
    }

    return await this.usersRepository.findOneBy(params);
  }
}
