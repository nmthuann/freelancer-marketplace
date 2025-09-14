import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('FREELANCER_MARKETPLACE_POST_DB_HOST'),
        port: parseInt(
          config.get<string>('FREELANCER_MARKETPLACE_POST_DB_PORT'),
          10,
        ),
        username: config.get<string>('FREELANCER_MARKETPLACE_POST_DB_USERNAME'),
        password: config.get<string>('FREELANCER_MARKETPLACE_POST_DB_PASSWORD'),
        database: config.get<string>(
          'FREELANCER_MARKETPLACE_POST_DB_DATABASE_NAME',
        ),
        synchronize: true,
      }),
    }),

    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class PostServiceModule {}
