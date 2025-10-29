import { Injectable } from '@nestjs/common';

@Injectable()
export class UuidService {
  async generate(): Promise<string> {
    const { v4: uuidv4 } = await import('uuid');
    return uuidv4();
  }
}
