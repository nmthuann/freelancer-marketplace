import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';

export interface IPostService {
  createPost(email: string, data: CreatePostDto): Promise<PostEntity>;
  getPosts(): Promise<PostEntity[]>;
  getPostById(id: number): Promise<PostEntity>;
  getPostByEmail(email: string): Promise<PostEntity[]>;
}
