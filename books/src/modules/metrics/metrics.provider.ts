import * as client from 'prom-client';

import { MetricsClient } from './metrics.interface';

export const METRICS_TOKEN = 'METRICS';
export const metricsProviders = [
  {
    provide: METRICS_TOKEN,
    useFactory: (): MetricsClient => client,
  },
];
