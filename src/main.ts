import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

// session.ts
import * as expressSession from 'express-session';

// DON'T use this in PRODUCTION
// const memoryStore = new expressSession.MemoryStore();
//
// export const session = expressSession({
//   secret: '8021efef-62fe-4a5d-8573-4a681b039a45',
//   resave: false,
//   saveUninitialized: true,
//   store: memoryStore,
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.use(session);
  const config = new DocumentBuilder()
    .setTitle(process.env.KC_API_CLIENT)
    .setDescription(process.env.API_DESCRIPTION)
    .setVersion(process.env.API_VERSION)
    .addTag(process.env.API_SWAGGER_TAGS)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
