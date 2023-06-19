import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  Version,
} from '@nestjs/common';
import { Response } from 'express';
import { BuscarEmpresa, EmpresaApi } from './openapi/empresa-swagger';
import { BuscarEmpresaUseCase } from '@domain/service/empresa/buscar-empresa/buscar-empresa.usecase';

@EmpresaApi()
@Controller({ path: '/empresas' })
export class EmpresaController {
  constructor(private readonly buscarEmpresaUseCase: BuscarEmpresaUseCase) {}

  @Version('1')
  @Get('/:empresaId')
  @BuscarEmpresa()
  async buscarEmpresa(
    @Param('empresaId') empresaId: number,
    @Res() response: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const result = await this.buscarEmpresaUseCase.execute(empresaId);
    return response.status(HttpStatus.OK).json(result);
  }
}
