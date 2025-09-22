export class PackageDetailDto {
  revision: string;
  deliveryDay: number;
  unitPrice: number;
}

export class PackageDto {
  packageId: number;
  packageName: string;
  packageDetail: PackageDetailDto;
}

export class PostResponse {
  // postId: number;
  postName: string;
  categoryDetailName: string;
  vote: number;
  postDetail: PostDetailDto;
}

export class PostDetailDto {
  profileUser: string;
  description: string;
  FAQ: string;
  packages: PackageDto[];
}
