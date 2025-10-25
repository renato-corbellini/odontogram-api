import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseType } from 'typeorm';

interface EnvVariables {
  engine: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  databaseName: string;
}

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get env(): EnvVariables {
    return {
      engine: this.configService.get<DatabaseType>(
        'DATABASE_ENGINE',
        'postgres',
      ),
      host: this.configService.get<string>('DATABASE_HOST', ''),
      port: this.configService.get<number>('DATABASE_PORT', 5432),
      username: this.configService.get<string>('DATABASE_USERNAME', ''),
      password: this.configService.get<string>('DATABASE_PASSWORD', ''),
      databaseName: this.configService.get<string>('DATABASE_NAME', ''),
    };
  }
}
