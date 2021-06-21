import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import {JaegerInterceptor} from '@chankamlam/nest-jaeger'

async function bootstrap() {
    const client = require('prom-client');
    const counter = new client.Counter({
        name: 'request_count',
        help: 'Request count',
        labelNames: ['ControllerName', 'ServiceName']
    });
    const histogram = new client.Histogram({
        name: 'execution_duration',
        help: 'Endpoint execution time',
        labelNames: ['ControllerName', 'ServiceName']
    });
    histogram.observe(10); 

    const winston = require('winston');
    const { ElasticsearchTransport } = require('winston-elasticsearch');
    const esTransportOpts = {
         level: 'info'
     };
    //const esTransport = new ElasticsearchTransport(esTransportOpts);
    const logger = winston.createLogger({
          transports: [
              new winston.transports.Console(),
              new winston.transports.File({ filename: '/home/logs/log.log' })
          ]
    });
    const app = await NestFactory.create(AppModule,{
      logger: logger,
    });
  const config = {
    serviceName: 'books-service',
    sampler: {
        type: "const",
        param: 1
    },
    reporter: {
        collectorEndpoint: process.env.JAEGER_AGENT_HOST+':'+process.env.JAEGER_AGENT_PORT + '/api/traces',
        logSpans: true
    },
};
const end = histogram.startTimer();                                              
const options = { baggagePrefix: "-JKa-" };  

  app.useGlobalInterceptors(new JaegerInterceptor(config,options,
  (req,res)=>{
    req.jaeger.log("info","book")
    req.jaeger.setTracingTag('trace', 'book');
    //const span = req.jaeger.createSpan("book");
    logger.info("book log test");
    //req.jaeger.setTracingTag('trace', 'book');
    //span.finish();
    counter.inc(1);
    console.log("inc 1");
    end();
  },
  (req,res)=>{
      
  }));
  await app.listen(8082);
}
bootstrap();
