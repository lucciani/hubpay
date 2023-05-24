import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return page swagger', () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      };
      appController.getDocs(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(302);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        `http://${process.env.HOST}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}/docs`,
      );
    });
  });
});
