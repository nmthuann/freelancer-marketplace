import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { PostStatusEnum } from './enums/post-status.enum';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostsDto } from './dto/find-posts.dto';
import { PricingTypeEnum } from './enums/pricing-type.enum';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  // ══════════════════════════════════════════
  // SELLER — Quản lý Post của mình
  // ══════════════════════════════════════════

  /**
   * Seller tạo Post mới → mặc định DRAFT
   */
  async createPost(
    sellerId: string,
    dto: CreatePostDto,
  ): Promise<PostDocument> {
    this.validatePackages(dto);

    const post = new this.postModel({
      ...dto,
      sellerId,
      status: PostStatusEnum.DRAFT,
    });

    return post.save();
  }

  /**
   * Seller cập nhật Post (chỉ được khi DRAFT hoặc PAUSED)
   */
  async updatePost(
    postId: string,
    sellerId: string,
    dto: UpdatePostDto,
  ): Promise<PostDocument> {
    const post = await this.findOneOrFail(postId);
    this.assertOwner(post, sellerId);

    const editableStatuses = [
      PostStatusEnum.DRAFT,
      PostStatusEnum.PAUSED,
      PostStatusEnum.DENIED,
    ];
    if (!editableStatuses.includes(post.status)) {
      throw new BadRequestException(
        `Không thể chỉnh sửa Post ở trạng thái "${post.status}". Hãy tạm dừng trước.`,
      );
    }

    if (dto.packages || dto.pricingType) {
      this.validatePackages({ ...post.toObject(), ...dto } as CreatePostDto);
    }

    Object.assign(post, dto);
    return post.save();
  }

  /**
   * Seller gửi Post lên để admin/hệ thống duyệt
   * DRAFT | DENIED → PENDING_REVIEW
   */
  async submitForReview(
    postId: string,
    sellerId: string,
  ): Promise<PostDocument> {
    const post = await this.findOneOrFail(postId);
    this.assertOwner(post, sellerId);

    const allowedFrom = [PostStatusEnum.DRAFT, PostStatusEnum.DENIED];
    if (!allowedFrom.includes(post.status)) {
      throw new BadRequestException(
        `Chỉ có thể submit từ trạng thái DRAFT hoặc DENIED, hiện tại: "${post.status}"`,
      );
    }

    post.status = PostStatusEnum.PENDING_REVIEW;
    return post.save();
  }

  /**
   * Seller tạm dừng Post
   * ACTIVE → PAUSED
   */
  async pausePost(postId: string, sellerId: string): Promise<PostDocument> {
    const post = await this.findOneOrFail(postId);
    this.assertOwner(post, sellerId);

    if (post.status !== PostStatusEnum.ACTIVE) {
      throw new BadRequestException('Chỉ có thể tạm dừng Post đang ACTIVE.');
    }

    post.status = PostStatusEnum.PAUSED;
    return post.save();
  }

  /**
   * Seller kích hoạt lại Post sau khi tạm dừng
   * PAUSED → ACTIVE
   */
  async resumePost(postId: string, sellerId: string): Promise<PostDocument> {
    const post = await this.findOneOrFail(postId);
    this.assertOwner(post, sellerId);

    if (post.status !== PostStatusEnum.PAUSED) {
      throw new BadRequestException('Chỉ có thể resume Post đang PAUSED.');
    }

    post.status = PostStatusEnum.ACTIVE;
    return post.save();
  }

  /**
   * Seller xoá Post (chỉ được khi DRAFT)
   */
  async deletePost(postId: string, sellerId: string): Promise<void> {
    const post = await this.findOneOrFail(postId);
    this.assertOwner(post, sellerId);

    if (post.status !== PostStatusEnum.DRAFT) {
      throw new BadRequestException('Chỉ có thể xoá Post ở trạng thái DRAFT.');
    }

    await post.deleteOne();
  }

  /**
   * Lấy tất cả Post của seller (bao gồm mọi trạng thái)
   */
  async getMyPosts(sellerId: string): Promise<PostDocument[]> {
    return this.postModel.find({ sellerId }).sort({ createdAt: -1 }).exec();
  }

  // ══════════════════════════════════════════
  // ADMIN — Duyệt Post
  // ══════════════════════════════════════════

  /**
   * Admin duyệt Post → ACTIVE
   * PENDING_REVIEW → ACTIVE
   */
  async approvePost(postId: string): Promise<PostDocument> {
    const post = await this.findOneOrFail(postId);

    if (post.status !== PostStatusEnum.PENDING_REVIEW) {
      throw new BadRequestException(
        'Post phải ở trạng thái PENDING_REVIEW để duyệt.',
      );
    }

    post.status = PostStatusEnum.ACTIVE;
    return post.save();
  }

  /**
   * Admin từ chối Post → DENIED (kèm lý do)
   * PENDING_REVIEW → DENIED
   */
  async denyPost(postId: string, reason: string): Promise<PostDocument> {
    const post = await this.findOneOrFail(postId);

    if (post.status !== PostStatusEnum.PENDING_REVIEW) {
      throw new BadRequestException(
        'Post phải ở trạng thái PENDING_REVIEW để từ chối.',
      );
    }

    post.status = PostStatusEnum.DENIED;
    // Lưu lý do từ chối vào một field nếu schema có — hoặc log ra event
    // post.deniedReason = reason;
    return post.save();
  }

  /**
   * Admin đánh dấu Post nổi bật (featured)
   */
  async setFeatured(
    postId: string,
    isFeatured: boolean,
  ): Promise<PostDocument> {
    const post = await this.findOneOrFail(postId);
    post.isFeatured = isFeatured;
    return post.save();
  }

  /**
   * Admin lấy danh sách Post đang chờ duyệt
   */
  async getPendingPosts(): Promise<PostDocument[]> {
    return this.postModel
      .find({ status: PostStatusEnum.PENDING_REVIEW })
      .sort({ createdAt: 1 }) // FIFO — duyệt theo thứ tự submit
      .exec();
  }

  // ══════════════════════════════════════════
  // BUYER / PUBLIC — Tìm kiếm & xem Post
  // ══════════════════════════════════════════

  /**
   * Tìm kiếm Post public (chỉ ACTIVE) với filter + sort + pagination
   */
  async searchPosts(query: FindPostsDto): Promise<{
    data: PostDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      keyword,
      category,
      subCategory,
      minPrice,
      maxPrice,
      deliveryDays,
      minRating,
      tags,
      languages,
      sellerId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: Record<string, any> = { status: PostStatusEnum.ACTIVE };

    // Full-text search
    if (keyword) {
      filter.$text = { $search: keyword };
    }

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (sellerId) filter.sellerId = sellerId;

    // Filter theo giá của gói đầu tiên (gói rẻ nhất)
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter['packages.0.price'] = {};
      if (minPrice !== undefined) filter['packages.0.price'].$gte = minPrice;
      if (maxPrice !== undefined) filter['packages.0.price'].$lte = maxPrice;
    }

    if (deliveryDays !== undefined) {
      filter['packages.0.deliveryDays'] = { $lte: deliveryDays };
    }

    if (minRating !== undefined) {
      filter['stats.averageRating'] = { $gte: minRating };
    }

    if (tags?.length) {
      filter.tags = { $in: tags };
    }

    if (languages?.length) {
      filter.languages = { $in: languages };
    }

    // Sort
    const sortMap: Record<string, string> = {
      averageRating: 'stats.averageRating',
      orders: 'stats.orders',
      price: 'packages.0.price',
      createdAt: 'createdAt',
    };
    const sortField = sortMap[sortBy] ?? 'createdAt';
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 } as any;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.postModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.postModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Xem chi tiết 1 Post (public) — tăng view count
   */
  async getPostDetail(postId: string): Promise<PostDocument> {
    const post = await this.postModel
      .findOneAndUpdate(
        { _id: postId, status: PostStatusEnum.ACTIVE },
        { $inc: { 'stats.views': 1 } },
        { new: true },
      )
      .exec();

    if (!post)
      throw new NotFoundException(
        'Post không tồn tại hoặc chưa được công khai.',
      );
    return post;
  }

  /**
   * Lấy Post nổi bật cho trang chủ
   */
  async getFeaturedPosts(limit = 10): Promise<PostDocument[]> {
    return this.postModel
      .find({ status: PostStatusEnum.ACTIVE, isFeatured: true })
      .sort({ 'stats.averageRating': -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Lấy Post tương tự (cùng category, khác seller)
   */
  async getRelatedPosts(postId: string, limit = 6): Promise<PostDocument[]> {
    const post = await this.findOneOrFail(postId);

    return this.postModel
      .find({
        _id: { $ne: postId },
        category: post.category,
        sellerId: { $ne: post.sellerId },
        status: PostStatusEnum.ACTIVE,
      })
      .sort({ 'stats.averageRating': -1 })
      .limit(limit)
      .exec();
  }

  // ══════════════════════════════════════════
  // INTERNAL — Gọi từ service khác (Order, Review...)
  // ══════════════════════════════════════════

  /**
   * Order service gọi sau khi order hoàn thành
   * Tăng completedOrders, cập nhật lại averageRating
   */
  async updateStatsAfterOrderCompleted(
    postId: string,
    newRating: number,
  ): Promise<void> {
    const post = await this.findOneOrFail(postId);
    const { totalReviews, averageRating } = post.stats;

    const newTotal = totalReviews + 1;
    const newAverage = (averageRating * totalReviews + newRating) / newTotal;

    await this.postModel.updateOne(
      { _id: postId },
      {
        $inc: {
          'stats.completedOrders': 1,
          'stats.totalReviews': 1,
        },
        $set: {
          'stats.averageRating': Math.round(newAverage * 10) / 10,
        },
      },
    );
  }

  /**
   * Order service gọi khi order được tạo
   */
  async incrementOrderCount(postId: string): Promise<void> {
    await this.postModel.updateOne(
      { _id: postId },
      { $inc: { 'stats.orders': 1 } },
    );
  }

  /**
   * Buyer bookmark/unbookmark Post
   */
  async toggleFavorite(postId: string, isFavoriting: boolean): Promise<void> {
    await this.postModel.updateOne(
      { _id: postId },
      { $inc: { 'stats.favorites': isFavoriting ? 1 : -1 } },
    );
  }

  /**
   * Lấy Post theo ID — không check status (dùng nội bộ)
   */
  async findById(postId: string): Promise<PostDocument> {
    return this.findOneOrFail(postId);
  }

  // ══════════════════════════════════════════
  // PRIVATE helpers
  // ══════════════════════════════════════════

  private async findOneOrFail(postId: string): Promise<PostDocument> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) throw new NotFoundException(`Post "${postId}" không tồn tại.`);
    return post;
  }

  private assertOwner(post: PostDocument, sellerId: string): void {
    if (post.sellerId !== sellerId) {
      throw new ForbiddenException('Bạn không có quyền thao tác Post này.');
    }
  }

  private validatePackages(dto: Partial<CreatePostDto>): void {
    const { pricingType, packages } = dto;
    if (!packages?.length) return;

    if (pricingType === PricingTypeEnum.SINGLE && packages.length !== 1) {
      throw new BadRequestException('SINGLE pricing chỉ được có đúng 1 gói.');
    }

    if (pricingType === PricingTypeEnum.TIERED && packages.length !== 3) {
      throw new BadRequestException(
        'TIERED pricing phải có đúng 3 gói (Basic, Standard, Premium).',
      );
    }
  }
}
