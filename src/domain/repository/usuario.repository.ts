import { UsuarioEntity } from '@domain/model/usuario.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IUsuarioRepository {
  abstract buscarUsuario(usuarioId: number): Promise<UsuarioEntity>;
  abstract aunthenticUsuario(secretId: string): Promise<UsuarioEntity>;
  abstract findBySecretId(secretId: string): Promise<UsuarioEntity>;
}
