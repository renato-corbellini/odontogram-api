import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AppConfigService,
  EnvironmentEnum,
  LogLevelEnum,
} from './config.service';

describe('AppConfigService', () => {
  let appConfigService: AppConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const values: Record<string, string | number> = {
                ALLOWED_ORIGINS:
                  'https://other.valid.url.com,http://localhost:3000',
                ENVIRONMENT: EnvironmentEnum.Development,
                PORT: 8080,
                SERVICE_NAME: 'test-service',
                LOG_LEVEL: LogLevelEnum.Info,
                JWT_SECRET: 'test-jwt-secret',
              };

              return values[key];
            }),
          },
        },
      ],
    }).compile();

    appConfigService = module.get<AppConfigService>(AppConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('env', () => {
    it('should return environment variables', () => {
      const result = appConfigService.env;

      expect(result).toEqual({
        allowedOrigins: [
          'https://other.valid.url.com',
          'http://localhost:3000',
        ],
        environment: EnvironmentEnum.Development,
        port: 8080,
        serviceName: 'test-service',
        logLevel: LogLevelEnum.Info,
        jwtSecret: 'test-jwt-secret',
      });

      expect(configService.get).toHaveBeenCalledWith('ALLOWED_ORIGINS', '');
      expect(configService.get).toHaveBeenCalledWith('PORT', 80);
      expect(configService.get).toHaveBeenCalledWith(
        'ENVIRONMENT',
        EnvironmentEnum.Local,
      );
      expect(configService.get).toHaveBeenCalledWith(
        'SERVICE_NAME',
        'odontogram-api',
      );
      expect(configService.get).toHaveBeenCalledWith(
        'LOG_LEVEL',
        LogLevelEnum.Info,
      );
      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET', '');
    });

    it('should return empty allowedOrigins if ALLOWED_ORIGINS is not set', () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('');

      const result = appConfigService.env;

      expect(result.allowedOrigins).toEqual(['']);
      expect(configService.get).toHaveBeenCalledWith('ALLOWED_ORIGINS', '');
    });
  });
});
