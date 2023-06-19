import { UsuarioEntity } from '@domain/model/usuario.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IUsuarioRepository {
  abstract findById(usuarioId: number, full?: boolean): Promise<UsuarioEntity>;
  abstract aunthenticUsuario(secretId: string): Promise<UsuarioEntity>;
  abstract findBySecretId(secretId: string): Promise<UsuarioEntity>;
  abstract find(): Promise<UsuarioEntity[]>;
  abstract create(usuario: UsuarioEntity): Promise<UsuarioEntity>;
  abstract update(
    usuarioId: number,
    usuario: UsuarioEntity,
  ): Promise<UsuarioEntity>;
}
