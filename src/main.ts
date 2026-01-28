import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './modules/config/env.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<EnvConfig>);

  const port = config.get('PORT');

  await app.listen(port);

  console.log(`🚀 Server is running on http://localhost:${port}/`);
}

bootstrap();
