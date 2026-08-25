import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { Post, PostSchema } from './schemas/post.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
