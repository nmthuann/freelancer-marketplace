import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { PackageEntity } from './entities/package.entity';
import { IPostService } from './post.service.interface';

@Injectable()
export class PostService implements IPostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(PackageEntity)
    private readonly packageRepository: Repository<PackageEntity>,
  ) {}
}
