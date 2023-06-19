import { Test } from '@nestjs/testing';
import { IEmpresaRepository } from '@domain/repository/empresa.repository';
import { EmpresaNotFoundException } from '@api/err/empresa-notfound.exception';
import { EmpresaEntity } from '@domain/model/empresa.entity';
import { BuscarEmpresaUseCase } from './buscar-empresa.usecase';
import { BuscarEmpresaResponseDTO } from '@api/model/empresa/response/buscar-empresa.response';

const empresa: EmpresaEntity = {
  id: 1,
  nome: 'Empresa Teste',
  secretKey: '123',
  ativo: true,
  usuarios: [],
};

describe('BuscarEmpresaUseCase', () => {
  let buscarEmpresaUseCase: BuscarEmpresaUseCase;
  let empresaRepository: IEmpresaRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BuscarEmpresaUseCase,
        {
          provide: IEmpresaRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    buscarEmpresaUseCase =
      moduleRef.get<BuscarEmpresaUseCase>(BuscarEmpresaUseCase);
    empresaRepository = moduleRef.get<IEmpresaRepository>(IEmpresaRepository);
  });

  it('should be defined', () => {
    expect(buscarEmpresaUseCase).toBeDefined();
    expect(empresaRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw EmpresaNotFoundException if empresa is inactive', async () => {
      // Arrange
      empresa.ativo = false;
      const empresaId = 1;

      jest.spyOn(empresaRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(buscarEmpresaUseCase.execute(empresaId)).rejects.toThrow(
        new EmpresaNotFoundException(
          `Empresa com id: ${empresaId} não está ativa ou não existe, favor entrar em contato com administrador do sistema.`,
        ),
      );
      expect(empresaRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should search for a company and return BuscarEmpresaResponseDTO', async () => {
      // Arrange
      const empresaId = 1;

      // Act
      jest.spyOn(empresaRepository, 'findById').mockResolvedValue(empresa);
      const result = await buscarEmpresaUseCase.execute(empresaId);

      // Assert
      expect(empresaRepository.findById).toHaveBeenCalledWith(empresaId);
      expect(empresaRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(BuscarEmpresaResponseDTO);
    });
  });
});
