import { BuscarEmpresaResponseDTO } from '@api/model/empresa/response/buscar-empresa.response';
import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

export function EmpresaApi() {
  return applyDecorators(ApiTags('Empresa'));
}

export function BuscarEmpresa() {
  return applyDecorators(
    ApiOperation({
      summary: 'Responsável por buscar empresa',
    }),
    ApiParam({
      name: 'empresaId',
      type: Number,
      description: 'Identificador da empresa',
    }),
    ApiOkResponse({
      type: BuscarEmpresaResponseDTO,
    }),
  );
}
