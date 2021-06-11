import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import {JaegerInterceptor} from '@chankamlam/nest-jaeger'

async function bootstrap() {
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
const options = { baggagePrefix: "-JKa-" };  

  app.useGlobalInterceptors(new JaegerInterceptor(config,options,
  (req,res)=>{
    req.jaeger.log("info","book")
    req.jaeger.setTracingTag('trace', 'book');
    //const span = req.jaeger.createSpan("book");
    logger.info("book log test");
    //req.jaeger.setTracingTag('trace', 'book');
    //span.finish();
  },
  (req,res)=>{
      
  }));
  await app.listen(8082);
}
bootstrap();
