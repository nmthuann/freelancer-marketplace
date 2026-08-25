import { Module } from '@nestjs/common';
import { PostModule } from '@app/post';

@Module({
  imports: [PostModule],
})
export class PostsModule {}
