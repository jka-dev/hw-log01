import { Controller, Get, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    @Inject("LOGGER_TOKEN") private readonly logger: Logger,
  ) {}

  @Get('/')
  async getMetrics(): Promise<string> {
    this.logger.info('in metrics controller');
    const metrics = await this.metricsService.getAllMetrics();
    this.logger.info(`Metrics = ${metrics}`);
    return metrics;
  }
}
