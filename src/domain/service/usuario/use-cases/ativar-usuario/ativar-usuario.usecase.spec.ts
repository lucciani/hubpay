import { Test } from '@nestjs/testing';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { AdicionarUsuarioRequestDTO } from '@api/model/usuario/request/adicionar-usuario.request';
import { UsuarioEntity } from '@domain/model/usuario.entity';
import { UsuarioNotFoundException } from '@api/err/usuario-notfound.exception';
import { AtivarUsuarioUseCase } from './ativar-usuario.usecase';

const usuarioAtual: UsuarioEntity = {
  id: 1,
  secretId: '123',
  secret: '$2b$10$3WR5fzGm7D4F/uXNjX6kwOe5W.djFtR5kdusbT2mwgrOnajLJnfaK',
  ativo: true,
  empresa: {
    id: 1,
    nome: 'Empresa Teste',
    secretKey: 'secret123',
    ativo: true,
    usuarios: [],
  },
};

const usuarioDTO: AdicionarUsuarioRequestDTO = {
  secretId: '123',
  empresaId: 1,
  secret: '123',
};

describe('AtivarUsuarioUseCase', () => {
  let ativarUsuarioUseCase: AtivarUsuarioUseCase;
  let usuarioRepository: IUsuarioRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AtivarUsuarioUseCase,
        {
          provide: IUsuarioRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    ativarUsuarioUseCase =
      moduleRef.get<AtivarUsuarioUseCase>(AtivarUsuarioUseCase);
    usuarioRepository = moduleRef.get<IUsuarioRepository>(IUsuarioRepository);
  });

  it('should be defined', () => {
    expect(ativarUsuarioUseCase).toBeDefined();
    expect(usuarioRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw User NotFoundException if user is inactive or does not exist', async () => {
      // Arrange
      const user = null;
      const usuarioId = 1;

      jest.spyOn(usuarioRepository, 'findById').mockResolvedValue(user);

      // Act & Assert
      await expect(ativarUsuarioUseCase.execute(usuarioId)).rejects.toThrow(
        new UsuarioNotFoundException(
          `Usuário com id: ${usuarioId} não está ativo ou não existe, favor entrar em contato com administrador do sistema.`,
        ),
      );
      expect(usuarioRepository.findById).toHaveBeenCalledTimes(1);
      expect(user).toEqual(null);
    });

    it('must activate the user and return code 204', async () => {
      // Arrange
      const usuarioId = 2;

      const novoUsuario: UsuarioEntity = {
        id: 2,
        secretId: usuarioDTO.secretId,
        secret: usuarioAtual.secret,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        empresa: {
          id: 1,
          nome: 'Empresa Teste',
          secretKey: 'secret123',
          ativo: true,
          usuarios: [],
        },
      };

      // Act
      jest.spyOn(usuarioRepository, 'findById').mockResolvedValue(novoUsuario);
      jest.spyOn(usuarioRepository, 'update').mockResolvedValue(novoUsuario);

      await ativarUsuarioUseCase.execute(usuarioId);

      const update = await usuarioRepository.update(usuarioId, novoUsuario);

      // Assert
      expect(usuarioRepository.findById).toHaveBeenCalledTimes(1);
      expect(update).toEqual(novoUsuario);
      // Add additional assertions for the response DTO properties if needed
    });
  });
});
