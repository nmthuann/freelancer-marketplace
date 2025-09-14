import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PostServiceModule } from './post-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PostServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3302,
      },
    },
  );
  await app.listen();
}
bootstrap();
