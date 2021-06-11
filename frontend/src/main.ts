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
    serviceName: 'frontend-service',
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

  // setup as global interceptor
   app.useGlobalInterceptors(new JaegerInterceptor(config,options,
    (req,res)=>{

      req.jaeger.log("info","frontend span")
      req.jaeger.setTracingTag('trace', 'frontend');
      logger.info("frontend log test");
      //const span = req.jaeger.createSpan("FrontSpan");
      //span.finish();
    },
    (req,res)=>{

    }));
  await app.listen(8083);
}
bootstrap();
