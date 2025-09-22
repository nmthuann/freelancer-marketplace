import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatePostRequest } from 'apps/api-gateway/src/posts/requests/create-post.request';
import { IPostService } from 'y/post/post.service.interface';

@Controller('')
export class PostsController {
  constructor(private readonly postService: IPostService) {}

  @MessagePattern('create-post')
  async createPost(data: { email: string; data: CreatePostRequest }) {
    return this.postService.createPost(data.email, { ...data.data });
  }

  @MessagePattern('get-posts')
  async getPosts() {
    return await this.postService.getPosts();
  }

  @MessagePattern('get-post-by-id')
  async getPostById(data: { id: number }) {
    return await this.postService.getPostById(data.id);
  }

  @MessagePattern('get-user-by-email')
  async getUserByEmail(data: { email: string }) {
    return this.postService.getPostByEmail(data.email);
  }
}
