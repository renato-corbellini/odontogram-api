import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum EnvironmentEnum {
  Local = 'local',
  Development = 'development',
  Quality = 'quality',
  Production = 'production',
}

export enum LogLevelEnum {
  Debug = 'debug',
  Info = 'info',
}

interface EnvVariables {
  allowedOrigins: string[];
  port: number;
  environment: EnvironmentEnum;
  serviceName: string;
  logLevel: LogLevelEnum;
  jwtSecret: string;
}

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): EnvVariables {
    return {
      allowedOrigins: this.configService
        .get<string>('ALLOWED_ORIGINS', '')
        .split(','),
      port: this.configService.get<number>('PORT', 80),
      environment: this.configService.get<EnvironmentEnum>(
        'ENVIRONMENT',
        EnvironmentEnum.Local,
      ),
      serviceName: this.configService.get<string>(
        'SERVICE_NAME',
        'odontogram-api',
      ),
      logLevel: this.configService.get<LogLevelEnum>(
        'LOG_LEVEL',
        LogLevelEnum.Info,
      ),
      jwtSecret: this.configService.get<string>('JWT_SECRET', ''),
    };
  }
}
