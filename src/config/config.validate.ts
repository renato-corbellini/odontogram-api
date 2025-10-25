import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function validateSchema<T extends object>(
  record: Record<string, unknown>,
  schema: ClassConstructor<T>,
): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const convertedRecord = plainToInstance(schema, record, {
    enableImplicitConversion: true,
  }) as T;

  const errors = validateSync(convertedRecord);

  if (errors.length > 0) {
    const detailedErrors = errors.map((err) => {
      const constraints = err.constraints
        ? Object.values(err.constraints).join(',a ')
        : 'Unknown validation error';

      return `Property ${err.property}: ${constraints}. Received value: ${err.value}`;
    });

    throw new Error(`Validation failed: ${detailedErrors.join('; ')}`);
  }

  return convertedRecord;
}
