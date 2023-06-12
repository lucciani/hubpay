import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { ExistUsuarioUseCase } from './exist-usuario.usecase';
import { AuthenticateResponseDTO } from '@api/model/auth/response/authenticate.response';

describe('ExistUsuarioUseCase', () => {
  let useCase: ExistUsuarioUseCase;
  let usuarioRepository: IUsuarioRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExistUsuarioUseCase,
        {
          provide: IUsuarioRepository,
          useValue: {
            findBySecretId: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get<ExistUsuarioUseCase>(ExistUsuarioUseCase);
    usuarioRepository = moduleRef.get<IUsuarioRepository>(IUsuarioRepository);
  });

  describe('execute', () => {
    it('should return existing usuario response', async () => {
      const secretId = 'user1';
      const mockUsuario = {
        id: 1,
        secretId: 'user1',
        secret: 'password1',
        ativo: true,
        empresa: {
          id: 1,
          nome: 'Empresa Teste',
          secretKey: 'secret123',
          ativo: true,
          usuarios: [], // Adicione a propriedade 'usuarios' aqui se necessário
        },
      };

      const mockResponse = new AuthenticateResponseDTO(
        mockUsuario.id,
        mockUsuario.secretId,
        mockUsuario.empresa.id,
      );

      jest
        .spyOn(usuarioRepository, 'findBySecretId')
        .mockResolvedValue(mockUsuario);

      const result = await useCase.execute(secretId);

      expect(usuarioRepository.findBySecretId).toHaveBeenCalledWith(secretId);
      expect(result).toEqual(mockResponse);
    });

    it('should throw not found exception if usuario is not found', async () => {
      const secretId = 'user1';

      jest.spyOn(usuarioRepository, 'findBySecretId').mockResolvedValue(null);

      await expect(useCase.execute(secretId)).rejects.toThrowError(
        new NotFoundException('Secret id ou secret incorreto'),
      );

      expect(usuarioRepository.findBySecretId).toHaveBeenCalledWith(secretId);
    });
  });
});
