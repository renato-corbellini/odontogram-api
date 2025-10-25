import { Injectable } from '@nestjs/common';
import { HealthResponse } from './interfaces';

@Injectable()
export class HealthService {
  get(): HealthResponse {
    return {
      ok: true,
    };
  }
}
