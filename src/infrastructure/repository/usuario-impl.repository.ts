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

  async findBySecretId(secretId: string): Promise<UsuarioEntity> {
    return this.usersRepository.findOneBy({ secretId, ativo: true });
  }

  async aunthenticUsuario(secretId: string): Promise<UsuarioEntity> {
    return await this.usersRepository.findOneBy({ secretId, ativo: true });
  }

  async buscarUsuario(usuarioId: number): Promise<UsuarioEntity> {
    return await this.usersRepository.findOneBy({ id: usuarioId, ativo: true });
  }
}
