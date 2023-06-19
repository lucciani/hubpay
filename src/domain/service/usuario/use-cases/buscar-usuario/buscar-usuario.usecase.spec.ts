import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { BuscarUsuarioResponseDTO } from '@api/model/usuario/response/buscar-usuario.response';
import { BuscarUsuarioUseCase } from './buscar-usuario.usecase';

describe('BuscarUsuarioUseCase', () => {
  let useCase: BuscarUsuarioUseCase;
  let usuarioRepository: IUsuarioRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BuscarUsuarioUseCase,
        {
          provide: IUsuarioRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get<BuscarUsuarioUseCase>(BuscarUsuarioUseCase);
    usuarioRepository = moduleRef.get<IUsuarioRepository>(IUsuarioRepository);
  });

  describe('execute', () => {
    it('should return the usuario when it exists', async () => {
      const usuarioId = 1;
      const mockUsuario = {
        id: 1,
        secretId: 'user1',
        secret: await bcrypt.hash('password1', 10),
        ativo: true,
        empresa: {
          id: 1,
          nome: 'Empresa Teste',
          secretKey: 'secret123',
          ativo: true,
          usuarios: [], // Adicione a propriedade 'usuarios' aqui se necessário
        },
      };
      const mockResponse = new BuscarUsuarioResponseDTO(
        mockUsuario.id,
        mockUsuario.secretId,
        mockUsuario.empresa.id,
        mockUsuario.empresa.nome,
      );

      jest.spyOn(usuarioRepository, 'findById').mockResolvedValue(mockUsuario);

      const result = await useCase.execute(usuarioId);

      expect(usuarioRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(result).toEqual(mockResponse);
    });

    it('should throw NotFoundException when the usuario does not exist', async () => {
      const usuarioId = 1;

      jest.spyOn(usuarioRepository, 'findById').mockResolvedValue(null);

      await expect(useCase.execute(usuarioId)).rejects.toThrowError(
        new NotFoundException(
          `Usuário de id: ${usuarioId} não foi encontrado.`,
        ),
      );

      expect(usuarioRepository.findById).toHaveBeenCalledWith(usuarioId);
    });
  });
});
