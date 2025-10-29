import { validate } from 'class-validator';
import { IdentifierHttpDto } from './identifier.http-dto';

describe('IdentifierHttpDto', () => {
  it('passes validation for a valid identifier', async () => {
    const dto = new IdentifierHttpDto();
    dto.identifier = 'validIdentifier';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('passes validation when identifier length is exactly 5', async () => {
    const dto = new IdentifierHttpDto();
    dto.identifier = 'abcde';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('passes validation when identifier length is exactly 50', async () => {
    const dto = new IdentifierHttpDto();
    dto.identifier = 'a'.repeat(50);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails validation when identifier is too short', async () => {
    const dto = new IdentifierHttpDto();
    dto.identifier = 'abcd';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails validation when identifier is too long', async () => {
    const dto = new IdentifierHttpDto();
    dto.identifier = 'a'.repeat(51);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails validation when identifier is not a string', async () => {
    const dto = new IdentifierHttpDto();
    dto.identifier = 12345 as unknown as string;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
