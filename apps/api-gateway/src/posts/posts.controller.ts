import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  Param,
  Get,
} from '@nestjs/common';
import { PostsClientProxy } from './post-client.proxy';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { CreatePostInterceptor } from 'apps/api-gateway/interceptors/create-post.interceptor';
import { CreatePostRequest } from './requests/create-post.request';
import { UserRequest } from '../users/requests/user.request';
import { CreateCategoryRequest } from './requests/create-category.request';

@Controller('')
export class PostsController {
  constructor(private readonly postsClientProxy: PostsClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post('posts')
  @UseInterceptors(CreatePostInterceptor)
  async createPost(
    @Request() req: UserRequest,
    @Body() createPostReq: CreatePostRequest,
  ) {
    return this.postsClientProxy.createPost(req.email, createPostReq);
  }

  @Get('posts')
  async getPosts() {
    return await this.postsClientProxy.getPosts();
  }

  @Get('posts/:id')
  async getPostById(@Param('id') id: number) {
    return await this.postsClientProxy.getPostById(id);
  }

  @Get('categories')
  async getCategories() {
    return await this.postsClientProxy.getCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  async createCategory(
    @Request() req: any,
    @Body() category: CreateCategoryRequest,
  ) {
    const email = req['email'];
    return await this.postsClientProxy.createCategory(email, category);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('posts')
  // async getPostsByEmail(@Param('email') email: string) {
  //   return await this.postsClientProxy.getPostsByEmail(email);
  // }
}
