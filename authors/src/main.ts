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
              //esTransport,
              new winston.transports.File({ filename: '/home/logs/log.log' })
          ]
    });
    const app = await NestFactory.create(AppModule,{
      logger: logger,
    });
  const config = {
    serviceName: 'authors-service',
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
        req.jaeger.log("info","authors")
        //const span = req.jaeger.createSpan("authors");
        req.jaeger.setTracingTag('trace', 'authors');
        logger.info("authors log test");
       // span.finish();
        
      },
      (req,res)=>{
          //const span = req.jaeger.createSpan("authors");
          //span.finish();
      }));
    await app.listen(8081);
}
bootstrap();
