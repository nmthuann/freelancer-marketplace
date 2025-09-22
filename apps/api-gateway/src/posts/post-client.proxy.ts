import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePostRequest } from './requests/create-post.request';
import { CreateCategoryRequest } from './requests/create-category.request';

@Injectable()
export class PostsClientProxy {
  constructor(@Inject('POSTS_SERVICE') private readonly client: ClientProxy) {}

  async createPost(email: string, data: CreatePostRequest) {
    return this.client.send('create-post', { email, data });
  }

  async getPosts() {
    return this.client.send('get-posts', {});
  }

  async createCategory(email: string, categoryDto: CreateCategoryRequest) {
    return this.client.send('create-category', { email, categoryDto });
  }

  async getCategories() {
    return this.client.send('get-categories', {});
  }

  async getPostById(id: number) {
    return this.client.send('get-post-by-id', { id });
  }
}
