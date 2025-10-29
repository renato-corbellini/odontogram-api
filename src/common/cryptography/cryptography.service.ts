import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptographyService {
  hash(stringToHash: string) {
    return bcrypt.hashSync(stringToHash, 10);
  }

  compare(data: string, encrypted: string) {
    return bcrypt.compareSync(data, encrypted);
  }
}
