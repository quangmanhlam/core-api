import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { configs } from './configs';
import { MainModule } from './main.module';
import { DefaultInterceptor } from './interceptors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);

  // enable cors
  app.enableCors();

  // setup use global interceptor
  app.useGlobalInterceptors(new DefaultInterceptor());

  // setup default validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    skipMissingProperties: true,

    // properties if not exists in object validator will be removed into the data object.
    whitelist: true,
  }));

  // set static assets
  const imagePath = configs.image.path === '.' ? join(__dirname, '..', 'public') : join(configs.image.path, 'public');
  app.useStaticAssets(imagePath);
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // ignore show documents in mode production
  if (configs.env !== 'prod' && configs.env !== 'production') {
    // setup swagger document api
    const config = new DocumentBuilder()
      .setTitle('MTB API Service')
      .setDescription('The MTB API service description')
      .setVersion('1.0.0')
      .addTag('MTB API')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs/api.html', app, document);
  }

  await app.listen(configs.app.port, configs.app.host || null);
}

bootstrap();
