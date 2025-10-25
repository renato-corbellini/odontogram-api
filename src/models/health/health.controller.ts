import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import type { HealthResponse } from './interfaces';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse()
  get(): HealthResponse {
    return this.healthService.get();
  }
}
