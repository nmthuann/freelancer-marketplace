import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsController } from './posts.controller';
import { PostsClientProxy } from './post-client.proxy';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'POSTS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('POST_SERVICE_HOST', 'localhost'),
            port: parseInt(config.get<string>('POST_SERVICE_PORT', '3302'), 10),
          },
        }),
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsClientProxy],
})
export class PostsModule {}
