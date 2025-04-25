import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { config } from './shared/config/config.service';

async function bootstrap() {
  const logger = new Logger('Server');
  const app = await NestFactory.create(AppModule);

  // Increase limit for JSON and URL-encoded bodies
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const sawggerConfig = new DocumentBuilder()
    .setTitle('Task Manager documentation')
    .setDescription('Contains all API related to the task manager')
    .setVersion('v1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, sawggerConfig);
  SwaggerModule.setup('/v1', app, document);

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: false,
  });
  await app.listen(config.PORT.APP_PORT, () => {
    logger.log(`Server started on ${config.PORT.APP_PORT}`);
  });
}
bootstrap();
