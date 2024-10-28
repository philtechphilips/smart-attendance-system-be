import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sawggerConfig = new DocumentBuilder()
    .setTitle('Task Manager documentation')
    .setDescription('Contains all API related to the task manager')
    .setVersion('v1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, sawggerConfig);
  SwaggerModule.setup('/v1', app, document);
  
  app.enableCors({
    origin: [
      'http://localhost:3000',
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: false,
  });
  await app.listen(8000);
}
bootstrap();
