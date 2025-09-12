import { Module } from '@nestjs/common';
import { PostServiceController } from './post-service.controller';
import { PostServiceService } from './post-service.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [PostServiceController],
  providers: [PostServiceService],
})
export class PostServiceModule {}
