import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptographyService } from '../common/cryptography/cryptography.service';
import { EmailService } from '../common/email/email.service';
import { UsersService } from '../models/users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: EmailService, useValue: {} },
        { provide: CryptographyService, useValue: { hash: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
