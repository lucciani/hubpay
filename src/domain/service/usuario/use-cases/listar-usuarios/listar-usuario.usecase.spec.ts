import { Test, TestingModule } from '@nestjs/testing';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { BuscarUsuarioResponseDTO } from '@api/model/usuario/response/buscar-usuario.response';
import { ListarUsuarioUseCase } from './listar-usuario.usecase';

describe('ListarUsuarioUseCase', () => {
  let listarUsuarioUseCase: ListarUsuarioUseCase;
  let usuarioRepository: IUsuarioRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarUsuarioUseCase,
        {
          provide: IUsuarioRepository,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    listarUsuarioUseCase =
      module.get<ListarUsuarioUseCase>(ListarUsuarioUseCase);
    usuarioRepository = module.get<IUsuarioRepository>(IUsuarioRepository);
  });

  describe('execute', () => {
    it('should return an empty array when no usuarios are found', async () => {
      const mockUsuarios = [];

      jest.spyOn(usuarioRepository, 'find').mockResolvedValue(mockUsuarios);

      const result = await listarUsuarioUseCase.execute();

      expect(usuarioRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return an array of BuscarUsuarioResponseDTO when usuarios are found', async () => {
      const mockUsuarios = [
        {
          id: 1,
          secretId: 'secret-id-1',
          secret: 'hashed-password',
          ativo: true,
          empresa: {
            id: 1,
            nome: 'Empresa 1',
            secretKey: 'secret123',
            ativo: true,
            usuarios: [],
          },
        },
        {
          id: 2,
          secretId: 'secret-id-2',
          secret: 'hashed-password',
          ativo: true,
          empresa: {
            id: 2,
            nome: 'Empresa 2',
            secretKey: 'secret123',
            ativo: true,
            usuarios: [],
          },
        },
      ];

      jest.spyOn(usuarioRepository, 'find').mockResolvedValue(mockUsuarios);

      const result = await listarUsuarioUseCase.execute();

      expect(usuarioRepository.find).toHaveBeenCalled();
      expect(result).toEqual([
        new BuscarUsuarioResponseDTO(1, 'secret-id-1', 1, 'Empresa 1'),
        new BuscarUsuarioResponseDTO(2, 'secret-id-2', 2, 'Empresa 2'),
      ]);
    });
  });
});
