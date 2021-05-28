import { Module } from '@nestjs/common';

import { AuthorsModule } from './modules/authors/authors.module';
import { RedisModule } from './modules/redis/redis.module';
//import {JaegerInterceptor} from "@chankamlam/nest-jaeger";
//import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [RedisModule, AuthorsModule]//, JaegerInterceptor],
//   providers: [
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: JaegerInterceptor,
//     },
//   ],//, JaegerInterceptor],

})
export class AppModule {}
