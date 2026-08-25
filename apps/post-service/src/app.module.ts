import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { MongoModule } from '@app/mongo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    MongoModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('POST_MONGO_URI'),
        dbName: config.get('POST_MONGO_DB_NAME'),
      }),
      inject: [ConfigService],
    }),

    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class PostServiceModule {}
