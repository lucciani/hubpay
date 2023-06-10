import { BuscarUsuarioResponseDTO } from '@api/model/usuario/response/buscar-usuario.response';
import { Mapper } from '@core/mapper/mapper';
import { UsuarioEntity } from '@domain/model/usuario.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BuscarUsuarioMapper
  implements Mapper<UsuarioEntity, BuscarUsuarioResponseDTO>
{
  async mapFrom(param: UsuarioEntity): Promise<BuscarUsuarioResponseDTO> {
    return new BuscarUsuarioResponseDTO(
      param.id,
      param.secretId,
      param.empresa.id,
      param.empresa.nome,
    );
  }
}
