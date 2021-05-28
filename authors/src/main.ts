import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import {JaegerInterceptor} from '@chankamlam/nest-jaeger'

// import { jaeger } from "jaeger-client"

// const config = {
//     serviceName: 'authors-service',
//     reporter: {
//       collectorEndpoint: 'http://localhost:6832/api/traces',
//       logSpans: true,
//     },
//     sampler: {
//       type: 'const',
//       param: 1
//     }
//   };
//   const options = {
//     tags: {
//       'authors.version': '0.0.0',
//     },
//     logger: console,
//   };
//   const tracer = initTracer(config, options);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = {
    serviceName: 'authors-service',
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
      // create a sub span under master span
      const span = req.jaeger.createSpan("AuthorsSpan");//, "BooksSpan");
    //   console.log(req);
    //   console.log("---");
    //   console.log(res);
        
      span.log("info","authors request...");
      span.setTag("authors-req",true);

      span.finish();
     // req.jaeger.tracer.inject(span);
    },
    (req,res)=>{
        
    }));
    
  await app.listen(8081);

}
bootstrap();
