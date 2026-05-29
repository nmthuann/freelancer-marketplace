export class FindPostsDto {
  keyword?: string; // full-text search
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  deliveryDays?: number; // giao trong tối đa N ngày
  minRating?: number;
  tags?: string[];
  languages?: string[];
  sellerId?: string; // lấy tất cả post của 1 seller
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'averageRating' | 'orders' | 'price';
  sortOrder?: 'asc' | 'desc';
}
