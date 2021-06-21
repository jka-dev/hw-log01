import { Inject, Injectable } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';

import { MetricsClient } from './metrics.interface';
import { METRICS_TOKEN } from './metrics.provider';

@Injectable()
export class MetricsService {
  private readonly requestCounter: Counter<string>;
  private readonly errorCounter: Counter<string>;
  private readonly requestExecutionTimeHistogram: Histogram<string>;

  constructor(
    @Inject(METRICS_TOKEN) private readonly metricsClient: MetricsClient,
  ) {
    this.requestCounter = new metricsClient.Counter({
      name: 'request_count',
      help: 'Request count',
      labelNames: ['ControllerName', 'ServiceName'],
    });
    this.errorCounter = new metricsClient.Counter({
      name: 'error_count',
      help: 'Error count',
      labelNames: ['ControllerName', 'ServiceName'],
    });
    this.requestExecutionTimeHistogram = new Histogram({
      name: 'execution_duration',
      help: 'Endpoint execution time ',
      labelNames: ['ControllerName', 'ServiceName'],
    });
  }

  incrementRequestCount(controllerName: string, serviceName: string): void {
    this.requestCounter.inc({
      ControllerName: controllerName,
      ServiceName: serviceName,
    });
  }

  incrementErrorCount(controllerName: string, serviceName: string): void {
    this.errorCounter.inc({
      ControllerName: controllerName,
      ServiceName: serviceName,
    });
  }

  observeRequestExecutionDuration(
    duration: number,
    controllerName: string,
    serviceName: string,
  ): void {
    this.requestExecutionTimeHistogram.observe(
      {
        ControllerName: controllerName,
        ServiceName: serviceName,
      },
      duration,
    );
  }

  async getAllMetrics(): Promise<any> {
    return this.metricsClient.register.metrics();
  }
}
