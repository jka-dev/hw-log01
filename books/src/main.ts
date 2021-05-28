import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import {JaegerInterceptor} from '@chankamlam/nest-jaeger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = {
    serviceName: 'books-service',
    sampler: {
        type: "const",
        param: 1
    },
    reporter: {
        collectorEndpoint: process.env.JAEGER_AGENT_HOST+':'+process.env.JAEGER_AGENT_PORT + '/api/traces'//"http://localhost:14268/api/traces"
    },
};                                             // required
const options = { baggagePrefix: "-JKa-" };  // optional,you can let options={}

  // setup as global interceptor
  app.useGlobalInterceptors(new JaegerInterceptor(config,options,
    (req,res)=>{
      // do something here before request if u want
      req.jaeger.log("info","just for global log");
      //const span = req.jaeger.createSpan("BooksSpan", "FrontSpan");
      const span = req.jaeger.createSpan("BooksSpan");
      
      span.log("info","book request...");
      span.setTag("book-req",true);

      span.finish();
      //req.jaeger.tracer.inject(span);
    },
    (req,res)=>{
      // do some thing here before response if u want
    }));
  await app.listen(8082);
}
bootstrap();
