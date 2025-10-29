import { Module } from '@nestjs/common';
import { CryptographyService } from './cryptography/cryptography.service';
import { EmailService } from './email/email.service';
import { UuidService } from './uuid/uuid.service';

@Module({
  providers: [EmailService, CryptographyService, UuidService],
  exports: [EmailService, CryptographyService, UuidService],
})
export class CommonModule {}
