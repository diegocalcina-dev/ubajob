import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3001);
  console.log(`API rodando em http://localhost:3001/api`);
}
bootstrap();
