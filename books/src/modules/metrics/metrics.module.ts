import { Inject, Module } from '@nestjs/common';

import { MetricsClient } from './metrics.interface';
import { metricsProviders, METRICS_TOKEN } from './metrics.provider';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';


@Module({
  controllers: [MetricsController],
  providers: [...metricsProviders, MetricsService],
  exports: [...metricsProviders, MetricsService],
})
export class MetricsModule {
  constructor(
    @Inject(METRICS_TOKEN) private readonly metricsClient: MetricsClient,
  ) {}

  onModuleInit() {
    const { Registry, collectDefaultMetrics } = this.metricsClient;

    const register = new Registry();
    collectDefaultMetrics({ register });
  }
}
