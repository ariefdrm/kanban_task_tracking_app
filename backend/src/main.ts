import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser';
import "dotenv/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Api Documentation')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, documentFactory)

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true
  })
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
