import { validate } from 'class-validator';
import { PasswordHttpDto } from './password.http-dto';

describe('PasswordHttpDto validation', () => {
  async function getPasswordConstraints(value: string) {
    const dto = new PasswordHttpDto();
    dto.password = value;
    const errors = await validate(dto);
    const pwdError = errors.find((e) => e.property === 'password');
    return pwdError ? pwdError.constraints || {} : {};
  }

  test('valid password passes validation', async () => {
    const dto = new PasswordHttpDto();
    dto.password = 'Valid1234';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  test('too short password fails MinLength', async () => {
    const constraints = await getPasswordConstraints('V1aBcd');
    expect(constraints).toHaveProperty('minLength');
  });

  test('too long password fails MaxLength', async () => {
    const long = 'Aa1' + 'b'.repeat(48); // total length 51
    const constraints = await getPasswordConstraints(long);
    expect(constraints).toHaveProperty('maxLength');
  });

  test('missing uppercase letter fails Matches with custom message', async () => {
    const constraints = await getPasswordConstraints('valid1234');
    expect(constraints).toHaveProperty('matches');
    expect(constraints.matches).toBe(
      'The password must have at least one uppercase letter, one lowercase letter and a number',
    );
  });

  test('missing lowercase letter fails Matches', async () => {
    const constraints = await getPasswordConstraints('VALID1234');
    expect(constraints).toHaveProperty('matches');
  });

  test('missing number or special character fails Matches', async () => {
    const constraints = await getPasswordConstraints('ValidPass');
    expect(constraints).toHaveProperty('matches');
  });

  test('non-string password fails IsString', async () => {
    const constraints = await getPasswordConstraints(
      12345678 as unknown as string,
    );
    expect(constraints).toHaveProperty('isString');
  });
});
