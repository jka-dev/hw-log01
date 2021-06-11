import { Body, Controller, Get, Inject, Param, Post, UseInterceptors, Req, SetMetadata } from '@nestjs/common';
import { RedisClient } from 'redis';

import { AuthorsService } from './authors.service';
import { AuthorDto, CreateAuthorInput } from './authors.dto';
import { REDIS_CONNECTION, REDIS_TOPIC } from '../redis/redis.providers';
//import { initTracer } from "jaeger-client"
import {JaegerInterceptor} from "@chankamlam/nest-jaeger";

//const tracer = initTracer("hello-world");

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

@Controller('api/v1/authors')
export class AuthorsController {
  constructor(
    private readonly authorsService: AuthorsService,
    @Inject(REDIS_CONNECTION)
    private readonly redisInstance: RedisClient,
  ) {}

  //@UseInterceptors(JaegerInterceptor)
  //@SetMetadata('ExceptJaegerInterceptor', true)
 // @UseInterceptors(JaegerInterceptor)
  @Get('/')
  
  getAuthors(): AuthorDto[] {
    console.log('Get authors4');
    //req.jaeger.setTag(req.jaeger.tags.ERROR,true)
    //req.jaeger.log("error","err....")
    //const span = tracer.startSpan("http_request");
    // const span = tracer.startSpan("get-authors");
    // span.setTag("hello-to", "jka");
    // const helloStr = `Hello, jka!`;
    // span.log({
    //   event: "string-format",
    //   value: helloStr,
    // });
    // span.log({ event: "print-string" });
    // span.finish();
    // console.log("test");
    //span.finish();
    //console.log(span);
    return this.authorsService.getAuthors();
  }

  //@UseInterceptors(JaegerInterceptor)
  @Get('/:id')
  getAuthorById(@Param('id') id: string): AuthorDto {
    console.log('Get author by ID');
    return this.authorsService.findById(id);
  }

  //@UseInterceptors(JaegerInterceptor)
  @Post('/')
  createAuthor(@Body() data: CreateAuthorInput): AuthorDto {
    console.log('Create author');
    const author = this.authorsService.create(data);
    this.sendPushNotification(author);
    return author;
  }

  private sendPushNotification(response: AuthorDto): void {
    this.redisInstance.set(REDIS_TOPIC, JSON.stringify(response));
  }
}
