import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseConfigService } from './config.service';

describe('DatabaseConfigService', () => {
  let databaseConfigService: DatabaseConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const values: Record<string, string | number> = {
                DATABASE_ENGINE: 'postgres',
                DATABASE_HOST: 'localhost',
                DATABASE_PORT: 5432,
                DATABASE_USERNAME: 'test-user',
                DATABASE_PASSWORD: 'test-password',
                DATABASE_NAME: 'test-database',
              };

              return values[key];
            }),
          },
        },
      ],
    }).compile();

    databaseConfigService = module.get<DatabaseConfigService>(
      DatabaseConfigService,
    );
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('env', () => {
    it('should return environment variables', () => {
      const result = databaseConfigService.env;

      expect(result).toEqual({
        engine: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test-user',
        password: 'test-password',
        databaseName: 'test-database',
      });

      expect(configService.get).toHaveBeenCalledWith(
        'DATABASE_ENGINE',
        'postgres',
      );
      expect(configService.get).toHaveBeenCalledWith('DATABASE_HOST', '');
      expect(configService.get).toHaveBeenCalledWith('DATABASE_PORT', 5432);
      expect(configService.get).toHaveBeenCalledWith('DATABASE_USERNAME', '');
      expect(configService.get).toHaveBeenCalledWith('DATABASE_PASSWORD', '');
      expect(configService.get).toHaveBeenCalledWith('DATABASE_NAME', '');
    });
  });
});
