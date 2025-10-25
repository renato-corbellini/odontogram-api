import * as bcrypt from 'bcrypt';

export function hash(stringToHash: string) {
  return bcrypt.hashSync(stringToHash, 10);
}

export function compare(data: string, encrypted: string) {
  return bcrypt.compareSync(data, encrypted);
}
