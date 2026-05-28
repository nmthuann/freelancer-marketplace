import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './appp.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3301,
      },
    },
  );
  await app.listen();
}
bootstrap();
