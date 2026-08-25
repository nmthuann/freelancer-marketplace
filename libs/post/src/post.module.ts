import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { Post, PostSchema } from './schemas/post.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
