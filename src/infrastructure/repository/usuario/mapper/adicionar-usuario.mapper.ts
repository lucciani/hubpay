import { AdicionarUsuarioRequestDTO } from '@api/model/usuario/request/adicionar-usuario.request';
import { SALTROUNDS } from '@core/config/constants';
import { Mapper } from '@core/mapper/mapper';
import { gerarHash } from '@core/utils/bcrypt.utils';
import { EmpresaEntity } from '@domain/model/empresa.entity';
import { UsuarioEntity } from '@domain/model/usuario.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdicionarUsuarioMapper
  implements Mapper<AdicionarUsuarioRequestDTO, UsuarioEntity>
{
  async mapFrom(usuario: AdicionarUsuarioRequestDTO): Promise<UsuarioEntity> {
    const configService = new ConfigService();

    const saltRounds = Number(configService.get(SALTROUNDS));
    const { secret } = usuario;
    const passSaltKey = `${secret}${saltRounds}`;

    const passwordMatch = await gerarHash(passSaltKey, saltRounds);

    const user = new UsuarioEntity();
    const empresa = new EmpresaEntity();
    user.secretId = usuario.secretId;
    user.secret = passwordMatch;
    empresa.id = usuario.empresaId;
    user.empresa = empresa;

    return user;
  }
}
